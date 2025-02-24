require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const otpStore = {}; // Store OTPs temporarily

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password (not your regular password)
  },
});

// Generate OTP function
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Step 1: Send OTP via Email
app.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// Step 2: Verify OTP
app.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email]; // Remove OTP after verification
    res.json({ token: "user-authenticated-token" }); // Replace with JWT in production
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
