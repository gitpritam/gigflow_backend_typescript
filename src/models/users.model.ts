import mongoose from "mongoose";
import IUser from "../@types/interface/schemas/user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("Users", userSchema);
export default User;
