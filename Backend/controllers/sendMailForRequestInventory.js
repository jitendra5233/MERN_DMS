const nodemailer = require("nodemailer");

const sendMail = async (
  senderName,
  senderEmail,
  receiverEmail,
  hostingName,
  renewalDate,
  client_name,
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword,
  emp_name,
  emp_code,
  job_title,
  item_name,
  quantity,
  request_date
) => {
  try {
    // connect with the smtp
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    const subject = `Inventory Request From ${emp_name}`;

    await transporter.sendMail({
      from: `"Techies Infotech" <${senderEmail}>`,
      to: receiverEmail,
      subject: subject,
      html: ` <div>
      <h2>Inventory Request From ${emp_name}</h2>
      <p><strong>Employee Name:</strong> ${emp_name}</p>
      <p><strong>Employee Code:</strong> ${emp_code}</p>
      <p><strong>Job Title:</strong> ${job_title}</p>
      <p><strong>Item Name:</strong> ${item_name}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Request Date:</strong> ${request_date}</p>
    </div>`,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
module.exports = sendMail;
