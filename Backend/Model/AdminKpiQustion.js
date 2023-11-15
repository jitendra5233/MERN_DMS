const mongoose = require("mongoose");

const AdminKpiQustion = mongoose.Schema(
  {
    department_id: {
      type: String,
      required: true,
    },
    department: {
      type: String,
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
  { timestamps: true }
);

const adminkpiquestion = mongoose.model("admin_kpi_question", AdminKpiQustion);

module.exports = adminkpiquestion;
