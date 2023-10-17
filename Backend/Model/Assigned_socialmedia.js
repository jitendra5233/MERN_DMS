const mongoose = require("mongoose");

const Assigned_socialmedia = mongoose.Schema(
  {
    assignedemp_id: {
      type: String,
      required: false,
    },
    emp_name: {
      type: String,
      required: false,
    },
    job_title: {
      type: String,
      required: false,
    },
    emp_code: {
      type: String,
      required: false,
    },
    client_name: {
      type: String,
      required: false,
    },
    icon_name: {
      type: String,
      required: false,
    },
    social_url: {
      type: String,
      required: false,
    },
    social_password: {
      type: String,
      required: false,
    },
    assigned_date: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const assigned_socialmedia = mongoose.model(
  "assigned_socialmedia",
  Assigned_socialmedia
);

module.exports = assigned_socialmedia;
