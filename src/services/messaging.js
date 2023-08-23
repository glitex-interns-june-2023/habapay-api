const axios = require("axios");

const sendOTP = async (phoneNumber) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  phoneNumber = `+254${phoneNumber.substring(phoneNumber.length - 9)}`;

  try {
    // send OTP using twilio verify
    const URL =
      "https://verify.twilio.com/v2/Services/VAaad951ebd0d8efdeec90fed1aeccc411/Verifications";
    const auth = `Basic ${Buffer.from(`${accountSid}: ${authToken}`).toString(
      "base64"
    )}`;

    const options = {
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    let data = new URLSearchParams({
      To: phoneNumber,
      Channel: "sms",
    }).toString();

    const response = await axios.post(URL, data, options);
    const { status } = response.data;

    // confirm verificatoion code sent successfully
    if (status != "pending") {
      const error = new Error("Could not send verification code");
      error.statusCode = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    const { status } = error.response;
    error.statusCode = status;
    throw error;
  }
};

const verifyOTP = async (phoneNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  phoneNumber = `+254${phoneNumber.substring(phoneNumber.length - 9)}`;

  try {
    // verify OTP using twilio verify
    const URL =
      "https://verify.twilio.com/v2/Services/VAaad951ebd0d8efdeec90fed1aeccc411/VerificationCheck";

    const data = new URLSearchParams({
      To: phoneNumber,
      Code: otp,
    });
    const auth = `Basic ${Buffer.from(`${accountSid}: ${authToken}`).toString(
      "base64"
    )}`;

    const options = {
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post(URL, data, options);
    const { status } = response.data;

    if (status != "approved") {
      const error = new Error("Verification failed: Invalid OTP");
      error.statusCode = 401;
      throw error;
    }

    return data;
  } catch (error) {
    const { status } = error.response;
    error.statusCode = status;
    throw error;
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
