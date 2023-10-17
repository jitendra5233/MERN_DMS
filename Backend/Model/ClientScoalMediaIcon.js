
const mongoose = require("mongoose");
const ClientScoalMediaIcon = mongoose.Schema(
  {
    client_id: {
      type: String,
      required: false,
    },
    icon_name: {
      type: String,
      required: false,
    },
    social_url: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const icon = mongoose.model("social_icon", ClientScoalMediaIcon);

module.exports = icon;
