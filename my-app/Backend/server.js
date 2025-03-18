const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const FILE_NAME = 'ContactData.xlsx';

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "S_a570P/?z",
    database: "decorlogindb"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
    } else {
        console.log("MySQL connected");
    }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "aviral0201sharma@gmail.com",
        pass: "feqs zzqa etvu pvrv",
    },
});

// Generate a random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
app.post("/send-email-otp", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    db.query(
        "INSERT INTO users (email, otp, otp_expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, otp_expiry=?",
        [email, otp, otpExpiry, otp, otpExpiry],
        (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            const mailOptions = {
                from: "aviral0201sharma@gmail.com",
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error("Email sending error:", error);
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

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    db.query(
        "SELECT otp, otp_expiry FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
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
            db.query(
                "UPDATE users SET otp=NULL, otp_expiry=NULL WHERE email=?",
                [email]
            );

            res.json({ message: "OTP verified successfully", token: "dummy-jwt-token" });
        }
    );
});

//  Add items to cart
app.post("/api/cart", (req, res) => {
    const { email, product } = req.body;

    console.log(`Received request to add to cart. Email: ${email}, Product:`, product);

    if (!email || !product || !product.id) {
        console.error("Invalid request data");
        return res.status(400).json({ message: "Email and product details are required" });
    }

    const { id, name, price } = product;

    const image = product.image || '';

    const quantity = 1; // Default to 1 for new products

    // Insert or update the cart
    db.query(
        `INSERT INTO cart (user_email, product_id, product_name, product_image, quantity, price)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
        [email, id, name, image[0], quantity, price],
        (err, result) => {
            if (err) {
                console.error("Database error while adding to cart:", err);
                return res.status(500).json({ message: "Failed to add product to cart" });
            }

            console.log(`Added product ${id} to ${email}'s cart`);
            res.json({ message: "Product added to cart" });
        }
    );
});

//  Fetch cart items
app.get("/api/cart/:email", (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    console.log(`Fetching cart for user: ${email}`);

    db.query(
        "SELECT product_id AS id, product_name AS name, product_image AS image, quantity, price FROM cart WHERE user_email = ?",
        [email],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            console.log("Cart data retrieved:", results);

            res.json(results);
        }
    );
});

// Remove item from cart
app.post("/api/cart/remove", (req, res) => {
    const { email, productId } = req.body;

    if (!email || !productId) {
        return res.status(400).json({ message: "Email and productId are required" });
    }

    db.query(
        "DELETE FROM cart WHERE user_email = ? AND product_id = ?",
        [email, productId],
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Failed to remove item from cart" });
            }

            res.json({ message: "Item removed from cart" });
        }
    );
});

app.post("/api/cart/update", (req, res) => {
    const { email, productId, quantity } = req.body;

    if (!email || !productId || quantity === undefined) {
        return res.status(400).json({ message: "Email, productId, and quantity are required" });
    }

    db.query(
        "UPDATE cart SET quantity = ? WHERE user_email = ? AND product_id = ?",
        [quantity, email, productId],
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Failed to update quantity" });
            }
            res.json({ message: "Cart updated successfully" });
        }
    );
});

app.post('/api/contact', (req, res) => {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let workbook;
    if (fs.existsSync(FILE_NAME)) {
        // Load existing file
        workbook = xlsx.readFile(FILE_NAME);
    } else {
        // Create new workbook
        workbook = xlsx.utils.book_new();
    }

    let worksheet;
    if (workbook.SheetNames.includes('Contacts')) {
        worksheet = workbook.Sheets['Contacts'];
    } else {
        worksheet = xlsx.utils.aoa_to_sheet([['Full Name', 'Email', 'Subject', 'Message']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    }

    // Get existing data and add new row
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push([fullName, email, subject, message]);
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);

    workbook.Sheets['Contacts'] = newWorksheet;

    // Write to file
    xlsx.writeFile(workbook, FILE_NAME);

    res.status(200).json({ message: 'Contact saved successfully' });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

