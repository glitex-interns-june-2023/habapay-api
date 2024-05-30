const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet } = require("../src/models");
const {
  generateWallets,
  generateUsers,
} = require("../src/utils/databaseSeeders");

const userData = generateUsers(20);
const walletData = generateWallets(20);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate(userData);
  await Wallet.bulkCreate(walletData);
});
afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/v1/wallet/withdraw", () => {
  it("should fail to send if sender does not have a verified phone number", async () => {
    const phoneA = "0114662464";
    const phoneB = "0712345678";
    const amount = 2000;

    const response = await request.post("/api/v1/wallet/withdraw").send({
      senderPhone: "07122222222",
      receiverPhone: phoneA,
      amount,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should fail to send if sender does not have sufficient funds in their account", async () => {
    const phoneA = "0114662464";
    const phoneB = "0712345678";
    const amount = 2000;

    const response = await request.post("/api/v1/wallet/withdraw").send({
      senderPhone: phoneB,
      receiverPhone: phoneA,
      amount,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should withdraw money from the user's(sender) account", async () => {
    const phoneA = "0114662464";
    const phoneB = "0712345678";
    const amount = 100;

    const response = await request.post("/api/v1/wallet/withdraw").send({
      senderPhone: phoneA,
      receiverPhone: phoneB,
      amount,
    });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("balance");
  });

  it("should debit the sender's account", async () => {
    const phoneA = "0114662464";
    const phoneB = "0712345678";
    const amount = 1000;

    const balanceRes = await request
      .get("/api/v1/wallet/balance")
      .query({ phone: phoneA });
    const initialBalance = balanceRes.body.data.balance;

    const response = await request.post("/api/v1/wallet/withdraw").send({
      senderPhone: phoneA,
      receiverPhone: phoneB,
      amount,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("balance");

    const newBalanceRes = await request.get("/api/v1/wallet/balance").query({
      phone: phoneA,
    });
    const newBalance = newBalanceRes.body.data.balance;

    expect(initialBalance - amount).toBe(newBalance);
  });

});