const mongoose = require("mongoose");

const RepairRecord = mongoose.Schema({
    item_name: {
    type: String,
    required: true,
  },
  serial_number: {
    type: String,
    required: true,
  },
  repair_count: {
    type: Number,
    required: true,
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

const repairRecord = mongoose.model("repair_record", RepairRecord);

module.exports = repairRecord;