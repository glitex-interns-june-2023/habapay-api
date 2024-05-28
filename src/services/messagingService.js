const axios = require("axios");
const nodemailer = require("nodemailer");
const AfricasTalking = require("africastalking");

const sendOTP = async (phoneNumber) => {

  // format phone number 
  phoneNumber = `+254${phoneNumber.substring(phoneNumber.length - 9)}`;

  const credentials = {
    apiKey: process.env.AFRICASTALKING_API_KEY, // use your sandbox app API key for development in the test environment
    username: process.env.AFRICASTALKING_USERNAME, // use 'sandbox' for development in the test environment
  };

  console.log("credentials: ", credentials)

  const africastalking = AfricasTalking(credentials);

  // Initialize a service e.g. SMS
  let sms = africastalking.SMS;

  console.log("phoneNumber: ", phoneNumber)
  // Use the service
  let options = {
    to: phoneNumber,
    message: "Your message goes here",
  };

  // Send message and capture the response or error
  try {
    const response = await sms.send(options);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
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

    try {
      const response = await axios.post(URL, data, options);
      const status = response.data.status;

      if (status != "approved") {
        const error = new Error("Verification failed: Invalid OTP");
        error.statusCode = 401;
        throw error;
      }

      return data;
    } catch (error) {
      // axios error handling
      const statusCode = error.response.status || 500;
      const message = error.response.data.message || "Verification failed";
      error = new Error(message);
      error.statusCode = statusCode;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const sendPin = async (email, pin) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verification PIN",
      text: `Your email verification PIN is ${pin}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const baseURL = process.env.BASE_URL;
    const verificationLink = `${baseURL}/api/v1/verifications/email/verify?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Habapay Email Verification",
      text: `Click on <a href="${verificationLink}">this link</a> to verify your email`,
      html: `Click on <a href="${verificationLink}">this link</a> to verify your email`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  sendPin,
  sendVerificationEmail,
  sendEmail,
};
