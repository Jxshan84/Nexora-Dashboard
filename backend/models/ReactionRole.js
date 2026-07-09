const mongoose = require("mongoose");

const reactionRoleSchema = new mongoose.Schema({

  guildId: {
    type: String,
    required: true
  },

  channelId: {
    type: String,
    required: true
  },

  messageId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    default: "Reaction Roles"
  },

  description: {
    type: String,
    default: "React below to receive your role."
  },

  color: {
    type: String,
    default: "#ff0000"
  },

  footer: {
    type: String,
    default: "Powered by RUDRA"
  },

  thumbnail: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    enum: [
      "normal",
      "unique",
      "verify",
      "toggle",
      "binding",
      "limit",
      "drop",
      "reversed",
      "temporary"
    ],
    default: "normal"
  },

  roles: [
    {
      emoji: {
        type: String,
        required: true
      },

      roleId: {
        type: String,
        required: true
      },

      label: {
        type: String,
        default: ""
      },

      description: {
        type: String,
        default: ""
      }
    }
  ],

  premium: {
    type: Boolean,
    default: false
  },

  maxUses: {
    type: Number,
    default: 0
  },

  requiredRole: {
    type: String,
    default: null
  },

  removeRoles: [{
    type: String
  }],

  createdBy: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

module.exports =
  mongoose.models.ReactionRole ||
  mongoose.model("ReactionRole", reactionRoleSchema);