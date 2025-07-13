import { sendEmailVerification, User } from "firebase/auth";

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; 
  }
}