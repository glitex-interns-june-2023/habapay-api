const {
  generatePaymentRef,
  createPayment,
  savePayment,
  getPaymentByRef,
  updatePaymentAmount,
  getAllPayments,
  updatePaymentRef,
} = require("../services/paymentService");
const walletService = require("../services/walletService");

const userService = require("../services/userService");
const UserNotFoundError = require("../errors/UserNotFoundError");

const getPaymentRef = async (req, res, next) => {
  const { userId, purpose } = req.query;
  try {
    const user = await userService.findById(userId);
    if (!user) {
      throw UserNotFoundError("No user with the given ID was found");
    }

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

const paystackPaymentCallback = async (req, res, next) => {
  console.log("Processing Payment Callback data ...");
  try {
    const {
      event,
      data: { reference, amount },
    } = req.body;

    const payment = await getPaymentByRef(reference);

    if (event == "charge.success") {
      if (payment.purpose == "deposit") {
        const correctedAmount = amount / 100;
        await updatePaymentAmount(reference, correctedAmount);
        await walletService.depositMoney(
          payment.userId,
          reference,
          correctedAmount
        );
      }
    }

    res.end();
  } catch (error) {
    console.log("Error in payment CallBack: ", error);
  }
};

const mpesaPaymentCallback = async (req, res, next) => {
  try {
    console.log("Processing M-Pesa Callback data: ", req.body);

    if (
      !req.body ||
      !req.body.Body ||
      !req.body.Body.stkCallback ||
      !req.body.Body.stkCallback.CallbackMetadata
    ) {
      console.error("Payment did not complete successfully: ", req.body);
      return;
    }

    const {
      Body: {
        stkCallback: {
          CallbackMetadata: { Item },
          ResultCode,
          ResultDesc,
        },
      },
    } = req.body;

    if (ResultCode !== 0) {
      console.log("M-Pesa transaction failed: ", ResultDesc);
      return res.status(400).json({
        success: false,
        message: "Transaction failed",
        data: { ResultDesc },
      });
    }

    const checkoutRequestId = req.body.Body.stkCallback.CheckoutRequestID;
    const receiptNumber = Item.find(
      (i) => i.Name === "MpesaReceiptNumber"
    )?.Value;
    const amount = parseFloat(
      Item.find((i) => i.Name === "Amount")?.Value || 0
    );
    const phoneNumber = Item.find((i) => i.Name === "PhoneNumber")?.Value;

    const payment = await getPaymentByRef(checkoutRequestId);

    if (payment && payment.purpose === "deposit") {
      await updatePaymentAmount(checkoutRequestId, amount);
      await updatePaymentRef(checkoutRequestId, receiptNumber);

      await walletService.depositMoney(payment.userId, receiptNumber, amount);
    }

    console.log("M-Pesa transaction processed successfully");

    return res.status(200).json({
      success: true,
      message: "M-Pesa transaction processed successfully",
    });
  } catch (error) {
    console.log("Error in M-Pesa Callback: ", error);
    next(error);
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
};

module.exports = {
  getPaymentRef,
  paystackPaymentCallback,
  mpesaPaymentCallback,
  getPayments,
};
