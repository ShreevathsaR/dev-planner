"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.emailTransporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL || "feedbacklib.app@gmail.com",
        pass: process.env.SMTP_PASSWORD || "rqqe rlum epzn huss",
    },
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text }) {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        text,
    };
    try {
        const info = yield exports.emailTransporter.sendMail(mailOptions);
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
    }
    catch (error) {
        console.error("Error sending verification email", error);
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
});
exports.sendEmail = sendEmail;
