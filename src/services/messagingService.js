const axios = require("axios");
const nodemailer = require("nodemailer");
const AfricasTalking = require("africastalking");
const verificationService = require("./verificationService");

const sendOTP = async (phoneNumber) => {
  // format phone number
  let formattedPhoneNumber = `+254${phoneNumber.substring(phoneNumber.length - 9)}`;

  const credentials = {
    apiKey: process.env.AFRICASTALKING_API_KEY, // use your sandbox app API key for development in the test environment
    username: process.env.AFRICASTALKING_USERNAME, // use 'sandbox' for development in the test environment
  };

  const africastalking = AfricasTalking(credentials);

  // Initialize a service e.g. SMS
  let sms = africastalking.SMS;

  const otp = Math.floor(100000 + Math.random() * 900000);

  // Use the service
  let options = {
    to: formattedPhoneNumber,
    message: `Your HabaPay Verification OTP is: ${otp}`,
    from: "Glitex",
  };

  // Send message and capture the response or error
  try {
    console.log(process.env.AFRICASTALKING_USERNAME, process.env.AFRICASTALKING_API_KEY);
    const response = await sms.send(options);
    // save OTP to database
    await verificationService.saveOtp(phoneNumber, otp);
    // check if response is successful
    const isSuccessful = response.SMSMessageData.Recipients.length > 0;
    
    if (!isSuccessful) {
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.log(error);
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
  sendPin,
  sendVerificationEmail,
  sendEmail,
};
