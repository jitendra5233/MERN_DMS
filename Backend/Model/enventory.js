const mongoose = require("mongoose");

const EnventorySchema = mongoose.Schema({
    item_name: {
    type: String,
    required: true,
  },
  assignment_date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  serial_number: {
    type: String,
    required: true,
  },
  emp_id: {
    type: String,
    required: true,
  },
  emp_name: {
    type: String,
    required: true,
  },
  emp_code: {
    type: String,
    required: true,
  },
  job_title:{
    type:String,
    require:true,
  },
  item_id:{
    type:Object,
    require:true,
  },
},
{ timestamps: true });

const enventory = mongoose.model("enventory", EnventorySchema);

module.exports = enventory;