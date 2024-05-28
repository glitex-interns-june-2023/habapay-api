const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { generateMpesaAccessToken } = require("../src/services/auth");

describe("Generating M-Pesa access token", () => {
  it("should generate M-Pesa access token", async () => {
    const token = await generateMpesaAccessToken();
    expect(token).toBeDefined();
  });
});

describe("POST /api/v1/mpesa/stkpush", () => {
    it("Should send stk prompt to given number", async () => {
        const phone = "0114662464";
        const amount = 1;
        const response = await request.post("/api/v1/mpesa/stkpush").send({phone, amount});
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    })
})