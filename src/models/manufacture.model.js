const { Schema, model } = require("mongoose");

const manufactureSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at" },
    versionKey: false,
  }
);

module.exports = model("manufacture", manufactureSchema);
