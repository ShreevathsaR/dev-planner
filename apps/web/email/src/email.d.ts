import nodemailer from "nodemailer";
export declare const emailTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
export declare const sendEmail: ({ to, subject, text }: {
    to: string;
    subject: string;
    text: string;
}) => Promise<{
    success: boolean;
    message: string;
}>;
