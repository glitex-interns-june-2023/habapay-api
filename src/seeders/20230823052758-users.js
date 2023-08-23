"use strict";

/** @type {import('sequelize-cli').Migration} */
const { generateUsers } = require("../utils/databaseSeeders");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      ...generateUsers(50),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
