const mongoose = require("mongoose");

const ExpenseSchema = mongoose.Schema({
    item_name: {
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
  paid_amount: {
    type: String,
    required: true,
  },
  r_paidamt: {
    type: String,
    required: true,
  },
  r_getamt: {
    type: String,
    required: true,
  },
},
{ timestamps: true });

const expense = mongoose.model("expense", ExpenseSchema);

module.exports = expense;