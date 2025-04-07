const axios = require("axios");
const { getTimestamp } = require("../utils");
const { generateMpesaAccessToken } = require("./authService");
const { StkPushError } = require("../errors/StkPushError");

const sendStkPush = async (phone, amount) => {
  phone = `254${phone.substring(phone.length - 9)}`;
  const mode = process.env.DARAJA_MODE || "sandbox";
  let url;
  if (mode === "sandbox") {
    url = `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;
  } else {
    url = `https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;
  }
  const accessToken = await generateMpesaAccessToken();
  const auth = `Bearer ${accessToken}`;
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${process.env.DARAJA_BUSINESS_SHORTCODE}${process.env.DARAJA_PASS_KEY}${timestamp}`
  ).toString("base64");
  const callBackURL = process.env.DARAJA_CALLBACK_URL;

  try {
    const response = await axios.post(
      url,
      {
        BusinessShortCode: process.env.DARAJA_BUSINESS_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.DARAJA_BUSINESS_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: callBackURL,
        AccountReference: "HabaPay",
        TransactionDesc: "HapaPay wallet topup",
      },
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    const data = response.data;
    if (data.ResponseCode != "0") {
      throw new StkPushError(data.ResponseDescription);
    }

    return data;
  } catch (error) {
    console.log("stkError", error);
    throw new StkPushError(error.message);
  }
};

// send a b2c request to mpesa
const b2c = async (phone, amount) => {
  const mode = process.env.DARAJA_MODE || "sandbox";
  let url;
  if (mode === "sandbox") {
    url = `https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`;
  } else {
    url = `https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`;
  }

  const accessToken = await generateMpesaAccessToken();
  const auth = `Bearer ${accessToken}`;
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${process.env.DARAJA_BUSINESS_SHORTCODE}${process.env.DARAJA_PASS_KEY}${timestamp}`
  ).toString("base64");

  const response = await axios.post(
    url,
    {
      SecurityCredential: password,
      CommandID: "BusinessPayment",
      Amount: amount,
      PartyA: process.env.DARAJA_BUSINESS_SHORTCODE,
      PartyB: phone,
      Remarks: "HabaPay Withdrawal",
      QueueTimeOutURL: "https://example.com",
      ResultURL: "https://example.com",
      Occasion: "HabaPay Withdrawal",
    },
    {
      headers: {
        Authorization: auth,
      },
    }
  );

  const data = response.data;
  return data;
};

const checkPaymentStatus = async (checkoutRequestId) => {
  const mode = process.env.DARAJA_MODE || "sandbox";
  let url;
  if (mode === "sandbox") {
    url = `https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query`;
  } else {
    url = `https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query`;
  }

  const accessToken = await generateMpesaAccessToken();
  const auth = `Bearer ${accessToken}`;
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${process.env.DARAJA_BUSINESS_SHORTCODE}${process.env.DARAJA_PASS_KEY}${timestamp}`
  ).toString("base64");

  const response = await axios.post(
    url,
    {
      BusinessShortCode: process.env.DARAJA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    },
    {
      headers: {
        Authorization: auth,
      },
    }
  );

  const data = response.data;

  if (data.ResponseCode != "0" || data.ResultCode != 0) {
    return null;
  }

  return data;
};

module.exports = {
  sendStkPush,
  checkPaymentStatus,
};
