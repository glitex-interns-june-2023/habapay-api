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

  it("should filter transactions by type when ?type parameter is passed", async () => {
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

describe("GET /api/v1/transactions/:id", () => {
  it("Should return 404 if not transaction with the given transaction id was found", async () => {
    const response = await request.get("/api/v1/transactions/30001");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty("message");
  });

  it("should return the transaction matching the transaction id if found ", async () => {
    const response = await request.get("/api/v1/transactions/12");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});

describe("GET /api/v1/user/:id/transactions", () => {
  it("Should return 404 if no user with the given id is found", async () => {
    const userId = 1236;
    const response = await request.get(`/api/v1/users/${userId}/transactions`);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });

  it("Should get user transactions", async () => {
    const userId = 2;
    const response = await request.get(`/api/v1/users/${userId}/transactions`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.data).toBeDefined();
    expect(response.body.data.data.length).toBeGreaterThan(0);
  });

  it("should allow pagination of response data", async () => {
    const userId = 2;
    const response = await request
      .get(`/api/v1/users/${userId}/transactions`)
      .query({
        page: 1,
        per_page: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toHaveLength(2);
  });

  it("should also filter results based on transaction type (ie. ?type=sent,received,withdraw or deposit)", async () => {
    const userId = 2;
    let transactions;

    let response = await request
      .get(`/api/v1/users/${userId}/transactions`)
      .query({ type: "sent" });
    expect(response.status).toBe(200);
    expect(response.body.data.data).toBeDefined();
    transactions = response.body.data.data;
    expect(transactions[0].transactions[0].type).toBe("sent");

    response = await request
      .get(`/api/v1/users/${userId}/transactions`)
      .query({ type: "received" });
    expect(response.status).toBe(200);
    expect(response.body.data.data).toBeDefined();
    transactions = response.body.data.data;
    expect(transactions[0].transactions[0].type).toBe("received");

    response = await request
      .get(`/api/v1/users/${userId}/transactions`)
      .query({ type: "withdraw" });
    expect(response.status).toBe(200);
    expect(response.body.data.data).toBeDefined();
    transactions = response.body.data.data;
    expect(transactions[0].transactions[0].type).toBe("withdraw");

    response = await request
      .get(`/api/v1/users/${userId}/transactions`)
      .query({ type: "deposit" });
    expect(response.status).toBe(200);
    expect(response.body.data.data).toBeDefined();
    transactions = response.body.data.data;
    expect(transactions[0].transactions[0].type).toBe("deposit");
  });
});
