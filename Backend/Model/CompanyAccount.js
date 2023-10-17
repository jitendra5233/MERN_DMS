
const mongoose = require("mongoose");
const CompanyAccount = mongoose.Schema(
  {
    hosting_name: {
      type: String,
      required: false,
    },
     
      hosting_url: {
        type: String,
        required: false,
      },
      services: {
        type: String,
        required: false,
      },

      client_name: {
        type: String,
        required: false,
      },
      client_id: {
        type: String,
        required: false,
      },


      username: {
        type: String,
        required: false,
      },
      password: {
      type: String,
      required: false,
    },
    renewal_date: {
        type: Date,
        required: true,
      },
      notification_date: {
        type: Date,
        required: true,
      },
  },
  { timestamps: true }
);

const company = mongoose.model("company_account", CompanyAccount);

module.exports = company;
