import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  // ✅ Get session
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

  const userId = user?._id;

  // ✅ Safely extract data from request body
  const { acceptMessages } = await req.json();

  if (typeof acceptMessages !== "boolean") {
    return Response.json(
      {
        success: false,
        message: "Invalid 'acceptMessages' value. It must be a boolean.",
      },
      { status: 400 }
    );
  }

  try {
    // ✅ Update user preference
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found or update failed.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully.",
        user: updatedUser,
      },
      { status: 200 } // ✅ should be 200, not 401
    );
  } catch (error) {
    console.error("Failed to update user status:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error while updating status.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  // ✅ Get the authenticated user session
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

  try {
    const foundUser = await UserModel.findById(user?._id).select(
      "isAcceptingMessage"
    );

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user status:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error while fetching user status.",
      },
      { status: 500 }
    );
  }
}
