const { Schema, model } = require("mongoose");

const artSchema = new Schema({
  title: { type: String },
  description: { type: String },
  medium: { type: String },
  price: {type: Number},
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  contact: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
});

module.exports = model("Art", artSchema);
