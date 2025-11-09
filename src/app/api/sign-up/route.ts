import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check for verified username (cannot reuse)
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    const existingUnverifiedUsername = await UserModel.findOne({
      username,
      isVerified: false,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    // ✅ If email exists but not verified → update
    if (existingUser && !existingUser.isVerified) {
      existingUser.username = username;
      existingUser.password = hashedPassword;
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpiry = expiryDate;
      await existingUser.save();
    }
    // ✅ If username exists but not verified → update same user
    else if (existingUnverifiedUsername) {
      existingUnverifiedUsername.email = email;
      existingUnverifiedUsername.password = hashedPassword;
      existingUnverifiedUsername.verifyCode = verifyCode;
      existingUnverifiedUsername.verifyCodeExpiry = expiryDate;
      await existingUnverifiedUsername.save();
    }
    // ✅ Otherwise → create new user
    else {
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
