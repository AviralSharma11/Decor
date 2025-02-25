const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection (Replace with your actual credentials)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Change this if your MySQL username is different
    password: "S_a570P/?z",  // Replace with your MySQL password
    database: "decorlogindb"  // Replace with your actual database name
});


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "aviral0201sharma@gmail.com",  // Replace with your email
        pass: "feqs zzqa etvu pvrv",  // Replace with your email password or app password
    },
});

// Generate a random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
app.post("/send-email-otp", (req, res) => {
    const { email } = req.body;
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    db.query(
        "INSERT INTO users (email, otp, otp_expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, otp_expiry=?",
        [email, otp, otpExpiry, otp, otpExpiry],
        (err) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            const mailOptions = {
                from: "your_email@gmail.com",
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: "Failed to send OTP" });
                }
                res.json({ message: "OTP sent successfully" });
            });
        }
    );
});

// Verify OTP
app.post("/verify-email-otp", (req, res) => {
    const { email, otp } = req.body;

    db.query(
        "SELECT otp, otp_expiry FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: "Email not found" });
            }

            const { otp: storedOtp, otp_expiry } = results[0];

            if (otp !== storedOtp || new Date() > new Date(otp_expiry)) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            // Clear OTP after successful verification
            db.query("UPDATE users SET otp=NULL, otp_expiry=NULL WHERE email=?", [email]);

            res.json({ message: "OTP verified successfully", token: "dummy-jwt-token" });
        }
    );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
