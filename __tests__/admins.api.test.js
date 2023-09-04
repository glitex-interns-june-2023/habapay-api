const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet, Transaction } = require("../src/models");
const {
  generateUsers,
  generateWallets,
  generateTransactions,
} = require("../src/utils/databaseSeeders");

const users = generateUsers(50);
const wallets = generateWallets(50);
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

describe("POST /api/v1/admins/transactions/:transactionId/approve", () => {
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
      `/api/v1/admins/transactions/${234434324}/approve`
    );
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("should return 200 if transaction is found and updated", async () => {
    const response = await request.post(
      `/api/v1/admins/transactions/${1}/approve`
    );
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // verify if transaction is updated
    const transaction = await Transaction.findByPk(1);
    expect(transaction.status).toBe("approved");
  });
});

describe.only("POST /api/v1/auth/register", () => {
  const data = {
    username: "Test Admin",
    phone: "0712345678",
    email: "test-admin@habapay.com",
    password: "password",
    secondaryPhone: "",
    businessName: "John's Business",
    location: "Nairobi, Kenya",
    loginPin: "1234",
  };

  it("should create an admin account", async () => {
    const response = await request.post("/api/v1/auth/register").send(data);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();

    const user = await User.findByPk(1);
    expect(user.email).toBe(data.email);
    expect(user.phone).toBe(data.phone);
  });

  it("should log in with the newly created email and password", async () => {
    const response = await request
      .post("/api/v1/auth/login")
      .send({ email: data.email, password: data.password });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty("access_token");
    expect(response.body.data).toHaveProperty("refresh_token");
  });

  it("should log in with the newly created login pin", async () => {
    const response = await request
      .post("/api/v1/auth/login/pin")
      .send({ email: data.email, pin: data.loginPin });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty("access_token");
    expect(response.body.data).toHaveProperty("refresh_token");
  });
});

describe.only("GET /api/v1/admins/users", () => {
  beforeEach(async () => {
    await User.bulkCreate(users);
    await Wallet.bulkCreate(wallets);
  });
  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should return all users with pagination", async () => {
    const response = await request.get("/api/v1/admins/users");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const users = response.body.data.data;

    expect(users.length).toBeGreaterThan(1);
    // verify correct response structure
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).toHaveProperty("username");
    expect(users[0]).toHaveProperty("phone");
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("status");
    expect(users[0]).toHaveProperty("balance");
  });
});
