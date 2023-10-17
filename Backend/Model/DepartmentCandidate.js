const mongoose = require("mongoose");

const DepartmentPositionsCandidateSchema = mongoose.Schema(
  {
    profile_id: {
      type: String,
      required: true,
    },
    ref_id: {
      type: String,
      required: true,
    },
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    l_salary: {
      type: String,
      required: true,
    },
    expected_salary: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    candidate_location: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: false,
    },
    reject: {
      type: String,
      required: false,
    },
    rejectComment: {
      type: String,
      required: false,
    },
    hired: {
      type: String,
      required: false,
    },
    interview: {
      type: String,
      required: false,
    },
    interview_date: {
      type: String,
      required: false,
    },
    interview_time: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const DepartmentPositionsCandidate = mongoose.model(
  "DepartmentPositionsCandidate",
  DepartmentPositionsCandidateSchema
);

module.exports = DepartmentPositionsCandidate;
