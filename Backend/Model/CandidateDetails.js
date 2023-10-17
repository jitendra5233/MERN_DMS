const mongoose = require("mongoose");

const CandidateDetailsSchema = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    f_name: {
      type: String,
      required: false,
    },
    l_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    aadhar_no: {
      type: String,
      required: false,
    },
    pan_no: {
      type: String,
      required: false,
    },
    bank_name: {
      type: String,
      required: false,
    },
    account_no: {
      type: String,
      required: false,
    },
    ifsc: {
      type: String,
      required: false,
    },
    date_of_joining: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    emp_code: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    job_title: {
      type: String,
      required: false,
    },
    office_email: {
      type: String,
      required: false,
    },
    office_email_password: {
      type: String,
      required: false,
    },
    p_address: {
      type: String,
      required: false,
    },
    t_address: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    employee_type: {
      type: String,
      required: false,
    },
    other_phone: {
      type: String,
      required: false,
    },
    emp_dob: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const CandidateDetails = mongoose.model(
  "CandidateDetails",
  CandidateDetailsSchema
);

module.exports = CandidateDetails;
