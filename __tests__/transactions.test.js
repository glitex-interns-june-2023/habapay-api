const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet, Transaction } = require("../src/models");
const {
  generateWallets,
  generateUsers,
  generateTransactions,
} = require("../src/utils/databaseSeeders");

const userData = generateUsers(20);
const walletData = generateWallets(20);
const transactions = generateTransactions(200);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.bulkCreate(userData);
  await Wallet.bulkCreate(walletData);
  await Transaction.bulkCreate(transactions);
});

afterEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /api/v1/transactions", () => {
  it("should get all transactions", async () => {
    const response = await request.get("/api/v1/transactions");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it.only("should filter transactions by type when ?type parameter is passed", async () => {
    const response = await request.get("/api/v1/transactions").query({
      type: "withdraw",
    });

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it("should return empty dataset on empty or invalid type parameter", async () => {
    const response = await request.get("/api/v1/transactions?type=unknown");
    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toHaveLength(0);
  });

  it("should list transactions with pagination e.g. for ?page=1&per_page=1", async () => {
    const response = await request.get("/api/v1/transactions").query({
      page: 1,
      per_page: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toHaveLength(1);
  });
});
