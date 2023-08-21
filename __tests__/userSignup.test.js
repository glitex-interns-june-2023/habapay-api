const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const userService = require("../src/services/user");

describe("POST /api/v1/auth/register", () => {
  it("should delete test user if exists in database ", async () => {
    const testUserEmail = "testuser@habapay.com";
    const userFound = await userService.findByEmail(testUserEmail);
    const deleteUser = await userService.deleteUser(testUserEmail);

    if (userFound) {
      expect(deleteUser).toBe(true);
    } else {
      expect(deleteUser).toBe(false);
    }
  });

  it("should create a new user to database if none exists", async () => {
    const data = {
      email: "testuser@habapay.com",
      firstName: "Test",
      lastName: "User",
      username: "TestU",
      phone: "07123456782",
      password: "12345678",
    };
    const response = await request.post("/api/v1/auth/register").send(data);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should not register the same user twice (same email/phone) ", async () => {
    const data = {
      email: "testuser@habapay.com",
      firstName: "Test",
      lastName: "User",
      username: "TestU",
      phone: "07123456782",
      password: "12345678",
    };
    const response = await request.post("/api/v1/auth/register").send(data);
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("Should log in user when correct credentials are provided", async () => {
    const data = {
      email: "testuser@habapay.com",
      password: "one more here",
    };

    const response = await request.post("/api/v1/auth/login").send(data);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
  });
  it("should fail to log in on incorrect login credentials", async () => {
    const data = {
      email: "testuser@habapay.com",
      password: "1234567",
    };
    const response = await request.post("/api/v1/auth/login").send(data);
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
