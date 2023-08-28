const mpesaService = require("../services/mpesaService");

const sendStkPush = async (req, res, next) => {
  const { phone, amount } = req.body;
  try {
    await mpesaService.sendStkPush(phone, amount);

    return res.status(200).json({
      success: true,
      message:
        "Mpesa request sent successfully. Please check on your phone to confirm the payment",
    });
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {};
module.exports = {
  sendStkPush,
  confirmPayment,
};
