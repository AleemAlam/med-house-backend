const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    postImg: { type: String, required: false },
    description: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at" },
    versionKey: false,
  }
);

module.exports = model("post", postSchema);
