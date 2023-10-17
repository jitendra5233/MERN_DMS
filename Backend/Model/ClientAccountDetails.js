
const mongoose = require("mongoose");

const ClientAccountDetails = mongoose.Schema(
  {
    client_name: {
      type: String,
      required: false,
    },
    client_designation: {
      type: String,
      required: false,
    },
    client_id: {
      type: String,
      required: true,
    },
    project_name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    client_status: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const client = mongoose.model("client_account", ClientAccountDetails);

module.exports = client;
