import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    state: {
      type: String,
      enum: ["MT", "MS", "DF", "Other"],
    },
    dateBirth: Date,
    phones: [String]
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;