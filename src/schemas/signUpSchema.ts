import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(
    2,
    "Username must be at least 2 characters and must not contain special characters"
  )
  .max(20, "Username no more than 20 Characters")
  .regex(/^[a-zA-Z0-9._]+$/, "USername must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be 6 characters" }),
});
