const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const userService = require("../src/services/user");
const { sequelize, User, Verification } = require("../src/models");
const { saveUser } = require("../src/services/user");

const data = {
  email: "testuser@habapay.com",
  firstName: "Test",
  lastName: "User",
  username: "TestU",
  phone: "07123456782",
  password: "12345678",
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await saveUser(data);
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/v1/auth/register", () => {
  it("should create a new user to database if none exists", async () => {
    const response = await request.post("/api/v1/auth/register").send({
      ...data,
      email: "testuser2@habapay.com",
      phone: "0712354876",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should automatically create a wallet for a user", async () => {
    const phone = "0712354876";
    let response = await request.post("/api/v1/auth/register").send({
      ...data,
      email: "testuser2@habapay.com",
      phone,
    });

    response = await request.get("/api/v1/wallet/balance").query({
      phone,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.balance).toBe(0);
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

describe("Send Reset Password Link", () => {
  beforeAll(async () => {
    // register a new user to test with
    await request.post("/api/v1/auth/register/bypass").send({
      ...data,
      email: "kariuki.joseph121@gmail.com",
      phone: "0114662464",
    });
  });

  it("should not send a reset password link to the user if the email does not exist", async () => {
    const response = await request.post("/api/v1/auth/reset-password").send({
      email: "wrong-email@gmail.com",
    });
    expect(response.status).toBe(404);
  });

  it("should send a reset password link to the user", async () => {
    const response = await request.post("/api/v1/auth/reset-password").send({
      email: "kariuki.joseph121@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  }, 20000);
});

describe.only("Reset Password", () => {
  let token;
  let email = "kariuki.joseph121@gmail.com";

  beforeAll(async () => {
    // register a new user to test with
    await request.post("/api/v1/auth/register/bypass").send({
      ...data,
      email: email,
      phone: "0114662464",
    });
  });

  beforeEach(async () => {
    const response = await request.post("/api/v1/auth/reset-password").send({
      email,
    });
    expect(response.status).toBe(200);

    // get token from db
    const verification = await Verification.findByPk(1);
    token = verification.token;
  });

  it("should fail to reset password if the token is invalid", async () => {
    const response = await request.put("/api/v1/auth/password").send({
      email,
      password: "1234",
      token: token + "wrong",
    });

    expect(response.body.success).toBe(false);
  });

  it.skip("should fail to reset password if the token is expired", async () => {
    const verification = await Verification.findByPk(1);
    verification.expiryTime = new Date(
      verification.expiryTime - 10000000
    );
    await verification.save();
      
    const response = await request.put("/api/v1/auth/password").send({
      email,
      password: "1234",
      token,
    });

    expect(response.body.success).toBe(false);
  });

  it("should reset password if the token is valid", async () => {
    const newPassword = "1234";
    const response = await request.put("/api/v1/auth/password").send({
      email,
      password: newPassword,
      token,
    });
    console.log(response.body)

    expect(response.status).toBe(200);
    const login = await request.post("/api/v1/auth/login").send({
      email,
      password: newPassword
    });

    console.log(login.body)
    expect(login.status).toBe(200);
  });
});
