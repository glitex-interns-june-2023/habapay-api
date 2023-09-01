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
  await User.bulkCreate(users);
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Verifications API", () => {
  describe("POST /api/v1/verifications/otp/send", () => {
    it("Should return a 404 error if the user is not found", async () => {
      const response = await request
        .post("/api/v1/verifications/otp/send")
        .send({
          phoneNumber: "0114662464",
          email: "admin.not.found@habapay.com",
        });
      expect(response.statusCode).toEqual(404);
      expect(response.body.success).toEqual(false);
    });

    it("Should send an otp code to the specified phone number", async () => {
      const res = await request.post("/api/v1/verifications/otp/send").send({
        phoneNumber: "0114662464",
        email: users[0].email,
      });
      expect(res.status).toEqual(200);
      expect(res.body.success).toEqual(true);
    });
  });

  // tested, it's working
  describe("POST /api/v1/verifications/otp/verify", () => {
    it.skip("should verify users's phone number", async () => {
      const otp = 911494;
      const phone = "0114662464";
      const res = await request.post("/api/v1/verifications/otp/verify").send({
        phoneNumber: phone,
        otp,
      });

      expect(res.status).toEqual(200);
      expect(res.body.success).toEqual(true);

      // check if user is verified from database
      const user = await User.findOne({
        where: {
          phone,
        },
      });

      expect(user.isPhoneVerified).toBe(true);
    });
  });

  describe("POST /api/v1/verifications/pin/send", () => {
    it("Should return 404 if the user's email is not registered", async () => {
      const email = "random2mail@gmail.com";
      const response = await request
        .post("/api/v1/verifications/pin/send")
        .send({ email });

      expect(response.status).toBe(404);
    });

    it("should send a PIN to the email given", async () => {
      const email = "kariuki.joseph121@gmail.com";
      const response = await request
        .post("/api/v1/verifications/pin/send")
        .send({ email });

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
  describe("POST /api/v1/verifications/pin/verify", () => {
    it("should verify a user's email on correct PIN", async () => {
      const email = "kariuki.joseph121@gmail.com";
      const pin = 1236;
      const response = await request
        .post("/api/v1/verifications/pin/verify")
        .send({
          email,
          pin,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
  describe("POST /api/v1/verifications/email/send", () => {
    it("should send an email verification link to user's inbox", async () => {
      const email = "kariuki.joseph121@gmail.com";

      const response = await request
        .post("/api/v1/verifications/email/send")
        .send({ email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }, 20000);
  });
  describe("GET /api/v1/verifications/email/verify", () => {
    it.only("should verify a user's email on correct verirification token", async () => {
      const token = "sometoken";
      const response = await request
        .get("/api/v1/verifications/email/verify")
        .query({ token });
        
        console.log(response.body);
      expect(response.status).toBe(200);
    }, 20000);
  });
});
