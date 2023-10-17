const mongoose = require("mongoose");

const EmployeeExitDocs = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const employeeexitdocs = mongoose.model("employeeexit_docs", EmployeeExitDocs);

module.exports = employeeexitdocs;