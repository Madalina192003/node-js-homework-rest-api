require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "test@example.com",
  from: process.env.SENDER_EMAIL,
  subject: "Test SendGrid",
  text: "Acesta este un test de email.",
  html: "<strong>Acesta este un test de email.</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("✅ Email sent successfully!");
  })
  .catch((error) => {
    console.error("❌ Error sending email:", error.response.body);
  });
