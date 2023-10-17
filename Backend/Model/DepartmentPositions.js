const mongoose = require("mongoose");

const DepartmentPositionsSchema = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: true,
    },
    name: {
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
    open_position: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    salary_range: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DepartmentPositions = mongoose.model(
  "DepartmentPositions",
  DepartmentPositionsSchema
);

module.exports = DepartmentPositions;
