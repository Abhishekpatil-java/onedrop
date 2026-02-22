const nodemailer = require("nodemailer");

const sendThankYouEmail = async (to, name, campaign, amount) => {
  try {
    console.log("📧 TO:", to);        // 👈 check this
    console.log("👤 NAME:", name);
    console.log("🎯 CAMPAIGN:", campaign);
    console.log("💰 AMOUNT:", amount);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CrowdFund" <${process.env.EMAIL_USER}>`,
      to,   // 👈 must be a real email string
      subject: "Thank you for your donation ❤️",
      html: `
        <h3>Hello ${name}</h3>
        <p>Thank you for donating <b>${amount}</b> to <b>${campaign}</b>.</p>
      `
    });

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ Email send error:", error.message);
  }
};

module.exports = sendThankYouEmail;
