const mongoose = require("mongoose");

const Appraisal = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    appraisal_p: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    appraisal: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const AppraisalSchema = mongoose.model("Appraisal", Appraisal);

module.exports = AppraisalSchema;
