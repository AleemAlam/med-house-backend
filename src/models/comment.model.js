const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    comment: { type: String, required: true },
  },
  {
    timeStamp: true,
    versionKey: false,
  }
);

module.exports = model("comment", commentSchema);
