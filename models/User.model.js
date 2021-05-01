const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, lowercase: true },
    passwordHash: { type: String },
    fullName: { type: String, trim: true},
    bio: { type: String },
    usertype: {
        type: String, 
        enum: ["user", "artist"], 
        default:"user"
        },
    profileImgUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
