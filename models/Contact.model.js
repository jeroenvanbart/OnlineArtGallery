const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  review: { type: String, maxlength: 200 },
});

module.exports = model("Contact", contactSchema);
