const mongoose = require("mongoose");

const DocsSchema = mongoose.Schema(
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

const Candidate_docs = mongoose.model("Candidate_docs", DocsSchema);

module.exports = Candidate_docs;
