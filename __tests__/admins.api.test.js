const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet, Transaction } = require("../src/models");
const {
  generateUsers,
  generateWallets,
  generateTransactions,
} = require("../src/utils/databaseSeeders");

const users = generateUsers(30);
const wallets = generateWallets(30);
const transactions = generateTransactions(200);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /api/v1/admins", () => {
  beforeEach(async () => {
    // run database seeders
    await User.bulkCreate(users);
  });

  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

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
});

describe("GET /api/v1/admins/transactions", () => {
  beforeEach(async () => {
    // run database seeders
    await User.bulkCreate(users);
    await Wallet.bulkCreate(wallets);
    await Transaction.bulkCreate(transactions);
  });

  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should return all transactions with correct structure", async () => {
    const response = await request.get("/api/v1/admins/transactions");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const data = response.body.data.data;
    expect(data.length).toBeGreaterThan(1);
    // test expected structure
    expect(data[0]).toHaveProperty("transaction_id");
    expect(data[0]).toHaveProperty("full_name");
    expect(data[0]).toHaveProperty("phone");
    expect(data[0]).toHaveProperty("currency");
    expect(data[0]).toHaveProperty("amount");
    expect(data[0]).toHaveProperty("type");
    expect(data[0]).toHaveProperty("timestamp");
  });

  it("should filter transactions by pending only e.g. ?status=pending", async () => {
    const response = await request
      .get("/api/v1/admins/transactions")
      .query({ status: "pending" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const data = response.body.data.data;
    // for all the data, check if the status is pending
    data.forEach((transaction) => {
      expect(transaction.status).toBe("pending");
    });
  });

  it("should filter transactions by approved only e.g. ?status=approved", async () => {
    const response = await request
      .get("/api/v1/admins/transactions")
      .query({ status: "approved" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const data = response.body.data.data;
    // for all the data, check if the status is pending
    data.forEach((transaction) => {
      expect(transaction.status).toBe("approved");
    });
  });
});

describe.only("POST /api/v1/admins/approve-transaction/:transactionId", () => {
  beforeEach(async () => {
    await User.bulkCreate(users);
    await Wallet.bulkCreate(wallets);
    await Transaction.bulkCreate(transactions);
  });
  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should return 404 if not transaction matching the id is found", async () => {
    const response = await request.post(
      `/api/v1/admins/approve-transaction/${234434324}`
    );
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should return 200 if transaction is found and updated", async () => {
    const response = await request.post(
      `/api/v1/admins/approve-transaction/${1}`
    );
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // verify if transaction is updated
    const transaction = await Transaction.findByPk(1);
    expect(transaction.status).toBe("approved");
  });
});
