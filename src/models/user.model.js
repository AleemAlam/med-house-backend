const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    businessType: { type: String, required: true },
    address: { type: String, required: true },
    profilePic: { type: String, required: false },
    drugLicense: { type: String, required: false },
    gstin: { type: String, required: false },
  },
  {
    timeStamp: true,
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err);
      resolve(same);
    });
  });
};

module.exports = model("user", userSchema);
