const { Schema, model } = require("mongoose");

const artSchema = new Schema({
  title: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = model("Art", artSchema);
