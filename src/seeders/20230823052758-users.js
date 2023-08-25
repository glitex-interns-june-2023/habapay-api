"use strict";

/** @type {import('sequelize-cli').Migration} */
const { generateUsers } = require("../utils/databaseSeeders");
const userData = generateUsers(50);
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", userData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
