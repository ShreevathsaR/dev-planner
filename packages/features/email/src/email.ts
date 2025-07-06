import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL || "feedbacklib.app@gmail.com",
    pass: process.env.SMTP_PASSWORD || "rqqe rlum epzn huss",
  },
});

export const sendEmail = async ({to, subject, text}: {to: string, subject: string, text: string}) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);

    if (info.rejected.length > 0) {
      console.log("Error sending mail", info.rejected);
      return {
        success: false,
        message: "Verification email not sent",
      };
    }

    console.log("Sent mail", info.messageId);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }

};
