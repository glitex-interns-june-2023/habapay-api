const axios = require("axios");
const generateAcessToken = async (req, res, next) => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const token = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
  ).toString("base64");
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    if(response.data && response.data.access_token) {
      req.darajaAccessToken = response.data.access_token;
      return next();
    }
    
    throw new Error("Could not get access token");
  } catch (error) {
    console.log("Get access token error");
    next(error);
  }
};

module.exports = {
  generateAcessToken,
};
