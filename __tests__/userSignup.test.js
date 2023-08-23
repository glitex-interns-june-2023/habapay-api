const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const userService = require("../src/services/user");
const { sequelize, User } = require("../src/models");
const { saveUser } = require("../src/services/user");

const data = {
  email: "testuser@habapay.com",
  firstName: "Test",
  lastName: "User",
  username: "TestU",
  phone: "07123456782",
  password: "12345678",
};

beforeEach(async () => {
  await sequelize.sync({ force: true });
  // create initial test data
  await saveUser(data);
});

afterEach(async () => {
  // clear test data and database connection
  await User.destroy({ truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});


describe("POST /api/v1/auth/register", () => {
  it("should delete test user if exists in database ", async () => {
    const testUserEmail = data.email;
    const userFound = await userService.findByEmail(testUserEmail);
    const deleteUser = await userService.deleteUser(testUserEmail);

    if (userFound) {
      expect(deleteUser).toBe(true);
    } else {
      expect(deleteUser).toBe(false);
    }
  });

  it("should create a new user to database if none exists", async () => {
    const response = await request.post("/api/v1/auth/register").send({
      ...data,
      email: "testuser2@habapay.com",
      phone: "0712354876"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should not register the same user twice (same email/phone) ", async () => {
    const response = await request.post("/api/v1/auth/register").send(data);
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("Should log in user when correct credentials are provided", async () => {
    const { email, password } = data;

    const response = await request
      .post("/api/v1/auth/login")
      .send({ email, password });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should fail to log in on incorrect login credentials", async () => {
    const { email } = data;
    const response = await request.post("/api/v1/auth/login").send({
      email,
      password: "somerandompassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
