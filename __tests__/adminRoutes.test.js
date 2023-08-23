const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User } = require("../src/models");
const { generateUsers } = require("../src/utils/databaseSeeders");

const users = generateUsers(30);

beforeEach(async () => {
    // run database seeders
    await sequelize.sync({ force: true });
    await User.bulkCreate([
        ...users
    ])
});

afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
});


describe("GET /api/v1/admins", () => {
    it("should return all admins", async () => {
        const response = await request.get("/api/v1/admins");
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.data.length).toBeGreaterThan(1);
    });

    it("should return 404 if no admin is found", async () => {
        await User.destroy({ where: { id: 2 } });
        const response = await request.get("/api/v1/admins/2");
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should return 200 if admin is found", async () => {
        const response = await request.get("/api/v1/admins/2");
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
})
