const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

const { sequelize, User } = require("../src/models");
const { generateUsers } = require("../src/utils/databaseSeeders");

const users = generateUsers(50);

beforeAll(async () => {
  // do something before anything else runs
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate([
    ...users,
  ]);
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.drop();
  await sequelize.close();
});

describe("POST /api/v1/auth/send-otp", () => {
  it("Should send an otp code to the specified phone number", async () => {
    const res = await request.post("/api/v1/auth/send-otp").send({
      phoneNumber: "0114662464",
      email: users[0].email,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it("Should return a 404 error if the user is not found", async () => {
    const response = await request.post("/api/v1/auth/send-otp").send({
      phoneNumber: "0114662464",
      email: "admin.not.found@habapay.com",
    });
    expect(response.statusCode).toEqual(404);
    expect(response.body.success).toEqual(false);
  });
});

describe("POST /api/v2/auth/verify-otp", () => {
  // tests for this route have been confirmed via postman
});
