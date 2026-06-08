import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
