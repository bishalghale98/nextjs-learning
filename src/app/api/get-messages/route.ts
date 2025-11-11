import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  // ✅ Authenticate user
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  if (!user?._id) {
    return Response.json(
      {
        success: false,
        message: "Invalid user ID.",
      },
      { status: 400 }
    );
  }

  try {
    // ✅ Convert string _id to ObjectId
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(user._id);
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "Invalid user ID format.",
        },
        { status: 400 }
      );
    }

    // ✅ First, check if user exists and get messages directly
    const userData = await UserModel.findById(userId).select("messages");
    
    if (!userData) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (!userData.messages || userData.messages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages available.",
          messages: [] // Return empty array instead of 404
        },
        { status: 200 } // Use 200 since user exists, just no messages
      );
    }

    // ✅ Sort messages by createdAt date (newest first)
    const sortedMessages = userData.messages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return Response.json(
      {
        success: true,
        messages: sortedMessages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching user messages:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while fetching messages.",
      },
      { status: 500 }
    );
  }
}