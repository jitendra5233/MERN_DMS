const mongoose = require("mongoose");

const DepartmentSchema = mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
