const mongoose = require("mongoose");

const IssuesAndFeedbackInnerSchema = mongoose.Schema(
  {
    ref_id: {
      type: String,
      required: false,
    },
    reply: {
      type: String,
      required: false,
    },
    fromAdmin: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const IssuesAndFeedbackInner = mongoose.model(
  "IssuesAndFeedbackInner",
  IssuesAndFeedbackInnerSchema
);

module.exports = IssuesAndFeedbackInner;
