const mongoose = require("mongoose");

const EnventoryCategory = mongoose.Schema(
  {
    category_name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const enventorycategory = mongoose.model("enventory_category", EnventoryCategory);

module.exports = enventorycategory;
