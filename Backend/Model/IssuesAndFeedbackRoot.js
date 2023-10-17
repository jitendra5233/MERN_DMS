const mongoose = require("mongoose");

const IssuesAndFeedbackRootSchema = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    anonymous: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const IssuesAndFeedbackRoot = mongoose.model(
  "IssuesAndFeedbackRoot",
  IssuesAndFeedbackRootSchema
);

module.exports = IssuesAndFeedbackRoot;
