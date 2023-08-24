const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, UserWallet } = require("../src/models");
const {
  generateUserWallets,
  generateUsers,
} = require("../src/utils/databaseSeeders");

const userData = generateUsers(20);
const walletData = generateUserWallets(20);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

beforeEach(async () => {
    await User.bulkCreate(userData);
    await UserWallet.bulkCreate(walletData);
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
      .send({ phone: "0114662464" });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("balance");
    expect(response.body.data.balance).toBe(walletData[1].balance);
  });
});
