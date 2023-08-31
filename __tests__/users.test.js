const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User } = require("../src/models");
const { generateUsers } = require("../src/utils/databaseSeeders");

const userData = generateUsers(100);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate(userData);
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /api/v1/users", ()=> {
    it("should list all users", async () => {
        const response = await request.get("/api/v1/users").query({
          page: 1,
          perPage: 20
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    })
})
