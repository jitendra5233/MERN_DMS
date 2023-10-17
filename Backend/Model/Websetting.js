
const mongoose = require("mongoose");
const { array } = require("../Service/imageUpload");

const Websetting = mongoose.Schema(
  {
    company_name: {
      type: String,
      required: false,
    },
    contact_email: {
      type: String,
      required: false,
    },
    carrer_email: {
      type: String,
      required: true,
    },
    watsapp_number: {
      type: String,
      required: false,
    },
    Contact_number: {
      type: String,
      required: true,
    },
     socialIcons: [
    {
      icon_name: String,
      social_url: String,
    },
  ],
    img: {
      type: String,
      required: true,
    },
    loginimg: {
      type: String,
      required: true,
    },
    smtp_host: {
      type: String,
      required: true,
    },
    smtp_port: {
      type: String,
      required: true,
    },
    smtp_username: {
      type: String,
      required: true,
    },
    smtp_password: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const websetting = mongoose.model("websetting", Websetting);

module.exports = websetting;
