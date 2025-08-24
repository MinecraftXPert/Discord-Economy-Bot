const mongoose = require("mongoose");

const dailyCooldownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const dailyCooldown = mongoose.model("dailycooldown", dailyCooldownSchema);

const crimeCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const crimeCoolDown = mongoose.model("crimecooldown", crimeCoolDownSchema);

const streamCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const streamCoolDown = mongoose.model("streamcooldown", streamCoolDownSchema);

const weeklyCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const weeklyCoolDown = mongoose.model("weeklycooldown", weeklyCoolDownSchema);

const monthlyCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const monthlyCoolDown = mongoose.model(
  "monthlycooldown",
  monthlyCoolDownSchema
);

const begCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const begCoolDown = mongoose.model("begcooldown", begCoolDownSchema);

const workCoolDownSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  expires: { type: Date },
});
const workCoolDown = mongoose.model("workcooldown", workCoolDownSchema);

module.exports = {
  dailyCooldown,
  crimeCoolDown,
  streamCoolDown,
  weeklyCoolDown,
  monthlyCoolDown,
  begCoolDown,
  workCoolDown,
};
