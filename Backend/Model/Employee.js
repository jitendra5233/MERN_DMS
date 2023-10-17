const mongoose = require("mongoose");

const Employee = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    emp_code: {
      type: String,
      required: true,
    },
    old_emp: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const EmployeeSchema = mongoose.model("Employee", Employee);

module.exports = EmployeeSchema;
