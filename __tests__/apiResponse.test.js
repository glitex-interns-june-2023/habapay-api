const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

describe("Test Api Response Keys", () => {
    it("should return response data with lowercase keys", async () => {
        const response = await request.get("/api/v1/test/correct");
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        const responseData = response.body;
        for( const key in responseData){
            const isLowercase = key === key.toLowerCase();
            expect(isLowercase).toBe(true);
        }

    });
    it("should return response data UPPERCASE keys(Intentional failing test)", async () => {
        const response = await request.get("/api/v1/test");
        expect(response.status).toBe(200);
        expect(response.type).toBe("application/json");
        const responseData = response.body;
        for( const key in responseData){
            const isUppercase = key === key.toUpperCase();
            expect(isUppercase).toBe(false);
        }
    });
});

describe("POST /api/v1/auth/google", () => {
    it("should return 401 if token is not provided", async () => {
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
