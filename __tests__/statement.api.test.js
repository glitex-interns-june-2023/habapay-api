const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);
const { sequelize, User, Wallet } = require("../src/models");
const { saveUser } = require("../src/services/user");

c