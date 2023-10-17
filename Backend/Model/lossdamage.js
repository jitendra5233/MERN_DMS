const mongoose = require("mongoose");

const LossDamageItem = mongoose.Schema({
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
  comment:{
    type:String,
    require:true,
  },
  repair_status:{
    type:String,
    require:true,
  }, 
},
{ timestamps: true });

const lossDamageItem = mongoose.model("loss_damage", LossDamageItem);

module.exports = lossDamageItem;