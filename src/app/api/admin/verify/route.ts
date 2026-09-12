import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passkey, email } = body;

    const configuredSecret = process.env.ADMIN_SECRET_KEY || "admin123456";

    // Check passkey match
    const isPasskeyValid = Boolean(
      passkey && passkey.trim() === configuredSecret.trim()
    );

    // Check email permission match (admin email or authorized developer)
    const isEmailPermitted = Boolean(
      email &&
        (email.toLowerCase().includes("admin") ||
          email.toLowerCase().endsWith("@smartshopbd.com"))
    );

    if (isPasskeyValid || isEmailPermitted) {
      const sessionToken = Buffer.from(
        `admin_authorized_${Date.now()}_${passkey ? "passkey" : "account"}`
      ).toString("base64");

      return NextResponse.json({
        success: true,
        message: "অ্যাডমিন পারমিশন ভেরিফাইড!",
        token: sessionToken,
        role: "admin",
        verifiedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "ভুল পারমিশন কি অথবা অনুমতি নেই। সঠিক সিক্রেট কী দিন।",
      },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
