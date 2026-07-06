const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: "No description"
  },

  price: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    enum: ["coins", "gems", "premiumGems"],
    default: "coins"
  },

  roleId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports =
  mongoose.models.ShopItem ||
  mongoose.model("ShopItem", shopItemSchema);