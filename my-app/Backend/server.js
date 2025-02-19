require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Store OTPs temporarily
const otpStore = {};

// Step 1: Send OTP via TextLocal
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  otpStore[phone] = otp;

  const apiKey = process.env.TEXTLOCAL_API_KEY;
  const sender = process.env.TEXTLOCAL_SENDER_ID; // Sender ID registered on TextLocal
  const message = `Your OTP code is ${otp}`;

  try {
    const response = await axios.post("https://api.textlocal.in/send/", null, {
      params: {
        apiKey,
        numbers: phone,
        sender,
        message,
      },
    });

    if (response.data.status === "success") {
      res.json({ success: true, message: "OTP sent successfully!" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Error sending OTP." });
  }
});

// Step 2: Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] && otpStore[phone] == otp) {
    delete otpStore[phone];
    res.json({ token: "user-authenticated-token" }); // Replace with JWT in production
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
