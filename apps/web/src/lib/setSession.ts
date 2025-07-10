"use server"
import { cookies } from "next/headers";

export const setSession = async (token: string) => {
  (await cookies()).set("devplanner.session", token, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const deleteCookie = async () => {
  (await cookies()).delete("devplanner.session");
};