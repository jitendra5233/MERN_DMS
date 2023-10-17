
const mongoose = require("mongoose");
const ClientAssignEmpDetails = mongoose.Schema(
  {
    client_id: {
      type: String,
      required: false,
    },
      client_name: {
        type: String,
        required: false,
      },
      client_userId: {
        type: String,
        required: false,
      },
      client_password: {
        type: String,
        required: false,
      },
      client_projectname: {
        type: String,
        required: false,
      },
    emp_name: {
      type: String,
      required: false,
    },
    job_title: {
      type: String,
      required: true,
    },
    emp_code: {
      type: String,
      required: true,
    },
    emp_status: {
      type: String,
      // required: true,
    },
    assignment_date: {
        type: Date,
        required: true,
      },
  },
  { timestamps: true }
);

const assignEmp = mongoose.model("assigned_employee", ClientAssignEmpDetails);

module.exports = assignEmp;
