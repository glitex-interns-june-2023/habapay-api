const {
  generatePaymentRef,
  createPayment,
  savePayment,
  getPaymentByRef,
  updatePaymentAmount,
  getAllPayments
} = require("../services/paymentService");
const walletService = require("../services/walletService");

const userService = require("../services/userService");

const getPaymentRef = async (req, res, next) => {
  const { userId, purpose } = req.query;
  try {
    const user = await userService.findById(userId);
    const paymentRef = generatePaymentRef();
    const payment = createPayment(user, paymentRef, purpose);
    console.log("Generated Payment: ", payment);
    await savePayment(payment);

    return res.status(200).json({
      success: true,
      mesage: "Ref generated successfully",
      data: {
        ref: paymentRef,
      },
    });
  } catch (error) {
    next(error);
  }
};

const paymentCallBack = async (req, res, next) => {
  console.log("Processing Payment Callback data: ", req.body)
  try {
    const {
      event,
      data: { reference, amount },
    } = req.body;

    const payment = await getPaymentByRef(reference);

    if (event == "charge.success") {
      if (payment.purpose == "deposit") {
        const correctedAmount = amount / 100;
        await updatePaymentAmount(reference, correctedAmount)
        await walletService.depositMoney(
          payment.userId,
          reference,
          correctedAmount
        );
      }
    }

    res.end()
  } catch (error) {
    console.log("Error in payment CallBack: ", error)
  }
};


const getPayments = async (req, res, next) => {
  try {
      const { page = 1, perPage = 10 } = req.query;
      const users = await getAllPayments(page, perPage);
  
      return res.status(200).json({
        success: true,
        message: "Payments fetched successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
}

module.exports = {
  getPaymentRef,
  paymentCallBack,
  getPayments
};
