const { Wallet } = require("../models");
const transactionService = require("../services/transactionService");
const mpesaService = require("../services/mpesaService");
const loggingService = require("../services/loggingService");

const getBalance = async (userId) => {
  const wallet = await getWallet(userId);

  return wallet.balance;
};

const sendMoney = async (senderId, receiverId, amount) => {
  const senderWallet = await getWallet(senderId);
  const receiverWallet = await getWallet(receiverId);

  verifyCanSend(senderWallet, amount);

  await transferFunds(senderWallet, receiverWallet, amount);

  const transaction = await transactionService.createSendTransaction(
    senderWallet,
    receiverWallet,
    amount
  );

  // Log transaction
  await loggingService.createSendMoneyLog(senderWallet, receiverWallet, amount);

  return transaction;
};

const getWallet = async (userId) => {
  let wallet = await Wallet.findOne({
    where: {
      userId,
    },
  });

  if (!wallet) {
    wallet = Wallet.create({
      userId,
      balance: 0.0,
      currency: "Ksh", 
    });
  }

  return wallet;
};

const verifyCanSend = (wallet, amount) => {
  if (wallet.balance < amount) {
    const error = new Error(
      `Transaction failed. You have insufficient funds to send ${wallet.currency} ${amount}. Your available account balance is ${wallet.currency} ${wallet.balance}`
    );
    error.statusCode = 400;
    throw error;
  }
  return true;
};

const verifyCanWithdraw = (wallet, amount) => {
  if (wallet.balance < amount) {
    const error =
      new Error(`Transaction failed. You have insufficient funds to withdraw ${wallet.currency} ${amount}. 
        Your current account balance is ${wallet.currency} ${wallet.balance}`);
    error.statusCode = 400;
    throw error;
  }

  return true;
};

const withdrawMoney = async (senderId, receiverId, amount) => {
  const senderWallet = await getWallet(senderId);
  const receiverWallet = await getWallet(receiverId);

  verifyCanWithdraw(senderWallet, amount);

  await updateWalletBalance(senderWallet, senderWallet.balance - amount);

  const transaction = await transactionService.createWithdrawTransaction(
    senderWallet,
    receiverWallet,
    amount
  );

  await loggingService.createWithdrawCashLog(senderWallet, amount);

  return transaction;
};

// transfer funds from one account to the next
const transferFunds = async (senderWallet, receiverWallet, amount) => {
  senderWallet.balance -= amount;
  await senderWallet.save();

  receiverWallet.balance += amount;
  await receiverWallet.save();
};

// update the balance of a user wallet
const updateWalletBalance = async (wallet, amount) => {
  wallet.balance = amount;
  await wallet.save();
};

const depositMoney = async (senderId, mpesaNumber, amount) => {
  const stkRes = await mpesaService.sendStkPush(mpesaNumber, amount);
  const { CheckoutRequestID } = stkRes;

  const wallet = await getWallet(senderId);
  wallet.balance += amount;
  await wallet.save();

  const transaction = await transactionService.createDepositTransaction(
    wallet,
    amount,
    CheckoutRequestID
  );

  await loggingService.createDepositCashLog(wallet, amount);

  return transaction;
};

const verifyDepositTransactions = async (user) => {
  const unCheckedTransactions =
    await transactionService.getUnCheckedDepositTransactions(user);

  if (unCheckedTransactions.length === 0) return;

  const checkedTransactionIds = [];
  const paidTransactionIds = [];
  const unPaidTransactionIds = [];
  for (const transaction of unCheckedTransactions) {
    const payment = await mpesaService.checkPaymentStatus(
      transaction.checkoutRequestId
    );
    
    if (payment) {
      paidTransactionIds.push(transaction.id);
    } else {
      unPaidTransactionIds.push(transaction.id);
    }

    checkedTransactionIds.push(transaction.id);
  }

  // updat to db
  await transactionService.updatePaidDepositTransactions(paidTransactionIds);
  await transactionService.updateUnPaidDepositTransactions(unPaidTransactionIds);
  await transactionService.updateCheckedTransactions(checkedTransactionIds);
};

module.exports = {
  getWallet,
  getBalance,
  sendMoney,
  withdrawMoney,
  depositMoney,
  verifyDepositTransactions,
};
