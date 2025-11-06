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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // ✅ Aggregate messages sorted by creation date
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // ✅ FIXED field name
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or no messages available.",
        },
        { status: 404 } // ✅ correct status
      );
    }

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
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
