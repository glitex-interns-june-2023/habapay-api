const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet } = require("../src/models");
const {
  generateUsers,
  generateWallets,
} = require("../src/utils/databaseSeeders");

const users = generateUsers(20);
const wallets = generateWallets(20);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate(users);
  await Wallet.bulkCreate(wallets);
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/v1/wallet/deposit", () => {
  it("should return 404 if senderPhone is not registered", async () => {
    const response = await request.post("/api/v1/wallet/deposit").send({
      senderPhone: "0712222222",
      mpesaNumber: "0114662464",
      amount: 1000,
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should credit sender wallet with amount deposited", async () => {
    const phone = "0712345678";
    const amount = 1000;
    // initial account balance
    let response = await request.get("/api/v1/wallet/balance").query({
      phone,
    });
    const initialBalance = response.body.data.balance;
    // deposit money
    response = await request.post("/api/v1/wallet/deposit").send({
      senderPhone: phone,
      mpesaNumber: "0114662464",
      amount,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // new balance
    response = await request.get("/api/v1/wallet/balance").query({
      phone,
    });
    
    const newBalance = response.body.data.balance;

    expect(newBalance).toBe(initialBalance + amount);
  });
});
