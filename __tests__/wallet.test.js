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

describe("GET /api/v1/wallet/balance", () => {
  it("should get the balance of the user given user phone number", async () => {
    const response = await request
      .get("/api/v1/wallet/balance")
      .query({ phone: "0114662464" });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveProperty("balance");
    expect(response.body.data.balance).toBe(walletData[1].balance);
  });
});

describe("POST /api/v1/wallet/send-money", () => {
  it("should fail if sender does not have a verified phone number", async () => {
    const response = await request.post("/api/v1/wallet/send-money").send({
      senderPhone: "07122222222",
      receiverPhone: "07122222223",
      amount: 20,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should fail to send if the receiver does not have a verified phone number", async () => {
    const response = await request.post("/api/v1/wallet/send-money").send({
      senderPhone: "0114662464",
      receiverPhone: "07122222223",
      amount: 20,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should send money from one user to another", async () => {
    const senderPhone = "0114662464";
    const receiverPhone = "0712345678";
    const amount = 20;

    let response = await request.get("/api/v1/wallet/balance").query({
      phone: senderPhone,
    });

    expect(response.body.success).toBe(true);
    const originalSenderBal = response.body.data.balance;

    response = await request.post("/api/v1/wallet/send-money").send({
      senderPhone,
      receiverPhone,
      amount: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(originalSenderBal - amount).toBe(response.body.data.new_balance);
  });

  it("on sending, it should deduct the amount from sender and credit the receiver", async () => {
    const senderPhone = "0114662464";
    const receiverPhone = "0712345678";
    const amount = 20;

    let senderBalance = await request.get("/api/v1/wallet/balance").query({
      phone: senderPhone,
    });

    const receiverBalance = await request.get("/api/v1/wallet/balance").query({
      phone: receiverPhone,
    });

    const senderBal = senderBalance.body.data.balance;
    const receiverBal = receiverBalance.body.data.balance;

    const response = await request.post("/api/v1/wallet/send-money").send({
      senderPhone,
      receiverPhone,
      amount,
    });

    expect(senderBal - amount).toBe(response.body.data.new_balance);

    // get new receiver balance
    const newReceiverBalance = await request
      .get("/api/v1/wallet/balance")
      .query({
        phone: receiverPhone,
      });

    expect(newReceiverBalance.body.success).toBe(true);
    expect(receiverBal + amount).toBe(newReceiverBalance.body.data.balance);
  });

  it("should fail to send money if you do not have enough balance", async () => {
    const senderPhone = "0712345678"; // has an initial balance of 0
    const receiverPhone = "0114662464";;
    const amount = 20;

    const response = await request.post("/api/v1/wallet/send-money").send({
      senderPhone,
      receiverPhone,
      amount
    });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  })
});

describe("GET /api/v1/wallet/confirm-details", () => {
  it("should return 404 if the user does not exist", async () => {
    const response = await request
      .get("/api/v1/wallet/confirm-details")
      .query({ phone: "07122222222" });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should return the phone number and the full names of the recipient", async()=>{
    const response = await request.get("/api/v1/wallet/confirm-details").query({
      phone: "0712345678",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("phone");
    expect(response.body.data).toHaveProperty("full_name");
  })
})
