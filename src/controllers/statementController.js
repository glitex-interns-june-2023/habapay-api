const userService = require("../services/userService");
const transactionService = require("../services/transactionService");
const statementService = require("../services/statementService");
const messagingService = require("../services/messagingService");

const downloadStatement = async (req, res, next) => {
  const { email, startDate, endDate, transactionType } = req.body;

  try {
    const user = await userService.findByEmail(email);

    // get user statement for the specified transaction type and date range
    const transactions = await transactionService.getAllUserTransactions(user, {
      type: transactionType,
      startDate,
      endDate,
    });

    const pdfPath = await statementService.generateStatement({
      ...transactions,
      transactionType,
    });

    // short form dates (Email body)
    const dateOptions = { year: "numeric", month: "short", day: "2-digit" };
    const formattedStartDate = new Date(startDate).toLocaleDateString(
      "en-Gb",
      dateOptions
    );
    const formattedEndDate = new Date(endDate).toLocaleDateString(
      "en-Gb",
      dateOptions
    );

    // iso dates (filename)
    const startDateIso = new Date(startDate).toISOString().slice(0, 10);
    const endDateIso = new Date(endDate).toISOString().slice(0, 10);

    const filename = `statement_${startDateIso}_to_${endDateIso}.pdf`;

    // slash dates(Subject header)
    const slasDateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const startDateSlash = new Date(startDate).toLocaleDateString("en-Gb", slasDateOptions);
    const endDateSlash = new Date(endDate).toLocaleDateString("en-Gb", slasDateOptions);

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Your HabaPay Statement for ${startDateSlash}-${endDateSlash}`,
      html: `
          <h1>Your HabaPay Statement</h1>
          <p>Dear ${user.firstName},</p>
          <p>We hope this email finds you well. Please find attached your statement for the period from <b style="color: #fdac15;">${formattedStartDate}</b> to <b style="color: #fdac15;">${formattedEndDate}</b> for Transaction Type: <b <b style="color: #fdac15;">${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1)}</b>.</p>
          <p>This statement includes all your transactions for the specified period. If you have any questions or need further information, please do not hesitate to contact us.</p>
          <p>Thank you for choosing HabaPay.</p>
          <p>Best regards,</p>
          <p>The HabaPay Team</p>
          <hr style="margin-top: 50px;">
          <p style="color: grey; text-align: center;">HabaPay - Small Savings, Big Future</p>
          <p style="color: grey; text-align: center; font-size: 11px;">HabaPay | Web: <a href="http://www.glitexsolutions.co.ke">www.glitexsolutions.co.ke</a> | Terms and conditions apply</p>
    `,
      attachments: [
        {
          filename: filename,
          path: pdfPath,
        },
      ],
    };

    await messagingService.sendEmail(mailOptions);

    // delete the pdf file after sending
    statementService.deletePdf(pdfPath);

    return res.status(200).json({
      success: true,
      data: "Statement has been generated and sent to your email. Please check your email inbox.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadStatement,
};
