const mongoose = require("mongoose");

const KpiQuestion = mongoose.Schema({
    emp_id: {
    type: String,
    required: true,
  },
  months: {
    type: String,
    required: true,
  },
  e_collaboration: {
    type: String,
  },
  r_collaboration: {
    type: String,
  },
  e_commitment: {
    type: String,
  },
  r_commitment: {
    type: String,
  },
  e_integrity: {
    type: String,
  },
  r_integrity: {
    type: String,
  },
  e_quality: {
    type: String,
  },
  r_quality: {
    type: String,
  },
  e_assesment: {
    type: String,
  },
  r_assesment: {
    type: String,
  },
  e_assesment1: {
    type: String,
  },
  r_assesment1: {
    type: String,
  },
  
  Emp_upadate_date:{
   type:String
  },
  Reviewer_upadate_date:{
    type:String
   },
  kpiQuestions: [
    {
      question: String,
      comment: String,
      rating: String,
      r_comment: String,
      r_rating: String,
    },
  ],
},
{ timestamps: true });

const kpiquestion = mongoose.model("kpi_question", KpiQuestion);

module.exports = kpiquestion;