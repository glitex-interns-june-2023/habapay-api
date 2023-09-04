const { Log, User } = require("../models");

const saveLog = async (log) => {
  const { userId, message, type } = log;

  await Log.create({
    userId,
    message,
    type,
  });
};

const createAccountCreationLog = async (user) => {
  const userId = user.id;
  const message = `<b>${user.username}</b> created a HabaPay account`;
  const type = "create_account";

  await saveLog({ userId, message, type });
};

const createSendMoneyLog = async (senderWallet, receiverWallet, amount) => {
  const sender = await User.findByPk(senderWallet.userId);
  const receiver = await User.findByPk(receiverWallet.userId);
  const message = `<b>${sender.username}</b> sent ${senderWallet.currency} ${amount} to </b>${receiver.username}</b>`;
  const type = "send";

  await saveLog({ userId: sender.id, message, type });
};

const createWithdrawCashLog = async (userWallet, amount) => {
  const user = await User.findByPk(userWallet.userId);
  const message = `<b>${user.username}</b> withdrew ${userWallet.currency} ${amount}`;
  const type = "withdraw";

  await saveLog({ userId: user.id, message, type });
};

const createDepositCashLog = async (userWallet, amount) => {
  const user = await User.findByPk(userWallet.userId);
  const message = `<b/>${user.username}</b> deposited ${userWallet.currency} ${amount} to wallet`;
  const type = "deposit";

  await saveLog({ userId: user.id, message, type });
};

module.exports = {
  createAccountCreationLog,
  createSendMoneyLog,
  createWithdrawCashLog,
  createDepositCashLog,
};
