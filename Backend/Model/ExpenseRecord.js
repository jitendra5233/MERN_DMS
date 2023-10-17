const mongoose = require("mongoose");

const ExpenseRecord = mongoose.Schema({
    item_name: {
    type: String,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  buying_date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
},
{ timestamps: true });

const expenserecord = mongoose.model("expense_record", ExpenseRecord);

module.exports = expenserecord;