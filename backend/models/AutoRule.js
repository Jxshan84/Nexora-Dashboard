const mongoose = require("mongoose");

const autoRuleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["respond", "react"],
    required: true
  },

  trigger: {
    type: String,
    required: true
  },

  response: {
    type: String,
    default: null
  },

  emoji: {
    type: String,
    default: null
  },

  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports =
  mongoose.models.AutoRule ||
  mongoose.model("AutoRule", autoRuleSchema);