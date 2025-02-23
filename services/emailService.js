const sgMail = require("@sendgrid/mail");
const { SENDER_EMAIL, BASE_URL } = process.env;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Verify your email",
    text: `Click this link to verify your email: ${BASE_URL}/api/auth/verify/${verificationToken}`,
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}">Verify Email</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Verification email sent");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendVerificationEmail };
