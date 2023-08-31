const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { generateUsers } = require("../src/utils/databaseSeeders");
const users = generateUsers(10);
const { sequelize, User } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate(users);
});

afterEach(async () => {
  await User.destroy({
    where: {},
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("PUT /api/v1/auth/login/pin", () => {
  it("should update login pin in the database", async () => {
    const email = "admin@habapay.com";
    const pin = 1234;
    const response = await request
      .put("/api/v1/auth/login/pin")
      .send({ email, pin });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("POST /api/v1/auth/login/pin", () => {
  it("should return 404 on invalid email", async () => {
    const email = "noone@habapay.com";
    const pin = 1234;
    const response = await request
      .post("/api/v1/auth/login/pin")
      .send({ email, pin });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should fail to login on valid email and wrong pin", async () => {
    const email = "admin@habapay.com";
    const pin = 1234;

    await request.put("/api/v1/auth/login/pin").send({ email, pin })

    const response = await request
      .post("/api/v1/auth/login/pin")
      .send({ email, pin: "12345" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should login on correct email and pin", async () => {
    const email = "admin@habapay.com";
    const pin = 124;
    await request.put("/api/v1/auth/login/pin").send({ email, pin });

    const response = await request
      .post("/api/v1/auth/login/pin")
      .send({ email, pin });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
