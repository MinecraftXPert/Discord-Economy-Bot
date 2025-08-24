const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  joined: { type: Boolean, default: false },
  balance: { type: Number, default: 500 },
  solana: { type: Number, default: 0 },
  hasJob: { type: Boolean, default: false },
  jobLevel: { type: Number, default: 1 },
  jobName: { type: String },
  income: { type: Number },
  jobCooldown: { type: Number },
  numTimesWorked: { type: Number },
});

module.exports = mongoose.model("User", userSchema);
