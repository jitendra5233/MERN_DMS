const mongoose = require("mongoose");

const EmployeeExitSchema = mongoose.Schema(
  {
    emp_name: {
      type: String,
      required: false,
    },
    emp_code: {
      type: String,
      required: false,
    },
    emp_id: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: true,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    personal_email: {
      type: String,
      required: true,
    },
    office_email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    leaveing_date: {
      type: Date,
      required: true,
    },

    resign_date: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    fnf_status: {
      type: String,
      required: true,
    },
    employee_docs: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const employeeexit = mongoose.model("employee_exit", EmployeeExitSchema);

module.exports = employeeexit;
