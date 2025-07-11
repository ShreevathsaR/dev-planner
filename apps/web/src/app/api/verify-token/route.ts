import { adminAuth } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res:NextResponse) {
  const { token } = await req.json();
  console.log("Verifying Token....");
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return NextResponse.json(
      { success: true, token: decodedToken.uid },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}
