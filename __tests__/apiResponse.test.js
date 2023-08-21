const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /api/v1/auth/google", () => {
    it("should return 400 if token is not provided", async () => {
        const data = {};
        const response = await request.post("/api/v1/auth/google").send(data);
        expect(response.status).toBe(400);
    });

    it("should return 401 if token is invalid", async () => {
        const data = {
            token: "invalid token"
        };
        const response = await request.post("/api/v1/auth/google").send(data);
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

});


