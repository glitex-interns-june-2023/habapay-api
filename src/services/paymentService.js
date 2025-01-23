const crypto = require("crypto");
const { Payment } = require("../models/");
const paginator = require("../middlewares/paginator");

const generatePaymentRef = () => crypto.randomBytes(5).toString("hex").toUpperCase();

const savePayment = async (payment) => {
  try {
    await Payment.create(payment)
  } catch (error) {
    throw error;
  }
};

const createPayment = (user, ref, purpose) => {
  return {
    userId: user.id,
    ref: ref,
    amount: 0,
    purpose: purpose,
  };
}

  const getPaymentByRef = async (ref) => {
    try {
        const payment = Payment.findOne({
            ref: ref
        })

        if(!payment) {
            throw Error("No payment with the given ref was found. Please make a new ref")
        }
        return payment
    } catch (error) {
        throw error
    }
  }
  
  const updatePaymentAmount = async (ref, amount) => {
    await Payment.update({ amount } , { where: { ref } })
  }


  const getAllPayments = async (page, perPage) => {
    page = parseInt(page);
    perPage = parseInt(perPage);
  
    const offset = (page - 1) * perPage;
    const payments = await Payment.findAndCountAll({
      offset,
      limit: perPage,
      raw: true,
    });
  
    const paginatedData = paginator(payments, page, perPage);
  
    return paginatedData;
  };

module.exports = {
  generatePaymentRef,
  createPayment,
  savePayment,
  getPaymentByRef,
  updatePaymentAmount,
  getAllPayments
};
