const userService = require('../services/userService');

const downloadStatement = async (req, res, next) => {
    const { transactionType, startDate, endDate, email } = req.body;
    