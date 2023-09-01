const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Business } = require("../src/models");
const { generateUsers } = require("../src/utils/databaseSeeders");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Business API", () => {
  describe("GET /api/v1/users/:userId/business", () => {
    it("should automatically create a business for a user on successful registration", async () => {
      // register a new user
      const userData = {
        email: "admin@habapay.com",
        firstName: "Admin",
        lastName: "User",
        username: "Admin User",
        phone: "0114662464",
        role: "admin",
        password: 12345678,
      };

      let response = await request.post("/api/v1/auth/register").send(userData);
      expect(response.status).toBe(201);

      //get the user's business
      response = await request.get("/api/v1/users/1/business");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("user_id");
      expect(response.body.data.user_id).toBe(1);
    });

    it("Should update user's business information ", async () => {
      // register a new user
      const userData = {
        email: "admin@habapay.com",
        firstName: "Admin",
        lastName: "User",
        username: "Admin User",
        phone: "0114662464",
        role: "admin",
        password: 12345678,
      };

      let response = await request.post("/api/v1/auth/register").send(userData);
      expect(response.status).toBe(201);

      const data = {
        name: "New Business Name",
      };
      response = await request.put("/api/v1/users/1/business").send(data);

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data.name).toBe(data.name);
    });
  });
});
