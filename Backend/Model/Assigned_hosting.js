const mongoose = require("mongoose");

const Assigned_hosting = mongoose.Schema(
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
    hosting_name: {
      type: String,
      required: false,
    },
    hosting_url: {
      type: String,
      required: false,
    },
    hosting_password: {
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

const assigned_hotingschema = mongoose.model("assigned_hosting", Assigned_hosting);

module.exports = assigned_hotingschema;
