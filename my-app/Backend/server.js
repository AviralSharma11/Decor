const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Razorpay = require("razorpay");
const ExcelJS = require("exceljs");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const feedbackRoutes = require("./routes/feedback.js");
const FILE_NAME = 'ContactData.xlsx';
const FILE_NAME2 = 'Sell On OceanWays.xlsx';

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
    } else {
        console.log("MySQL connected");
    }
});

const promiseDb = db.promise();


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Generate a random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Email
app.post("/api/send-email-otp", (req, res) => {
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
app.post("/api/verify-email-otp", (req, res) => {
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

// Add item to cart
app.post("/api/cart", (req, res) => {
  const {
    email,
    product,
    productId,
    productName,
    price,
    discountedPrice,
    customText1,
    uploadedPhoto,
    image // may come from frontend
  } = req.body;

  if (!email || !productId) {
    return res.status(400).json({ message: "Email and productId are required" });
  }

  const finalPrice = Number(discountedPrice || price || 0);

  // If no image provided, fetch from products table
  const getProductQuery = "SELECT image FROM products WHERE id = ?";

  db.query(getProductQuery, [productId], (err, productResult) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error fetching product" });
    }

    // Parse image from DB (fallback if req.body.image is missing)
    let imageArray = [];
    try {
      if (image) {
        imageArray = Array.isArray(image) ? image : [image];
      } else if (productResult.length > 0) {
        const dbImage = productResult[0].image;
        imageArray = JSON.parse(dbImage || "[]");
        if (!Array.isArray(imageArray)) imageArray = [imageArray];
      }
    } catch {
      imageArray = [];
    }

    const p = product || {
      id: productId,
      name: productName,
      price: finalPrice,
      image: imageArray,
      customText1,
      uploadedPhoto
    };

    const storedImage = JSON.stringify(imageArray); // store as JSON
    const quantity = 1;
    const textJson = p.customText1 ? JSON.stringify({ customText1: p.customText1 }) : null;
    const photoBuffer = p.uploadedPhoto ? Buffer.from(p.uploadedPhoto, "base64") : null;

    db.query(
      `INSERT INTO cart 
        (user_email, product_id, product_name, product_image, quantity, price, custom_text, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
      [email, p.id, p.name, storedImage, quantity, p.price, textJson, photoBuffer],
      (err, result) => {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ message: "Failed to add product to cart" });
        }
        res.json({ message: "Product added/updated in cart" });
      }
    );
  });
});


// Fetch cart items
app.get("/api/cart/:email", (req, res) => {
  const email = req.params.email;

  if (!email) return res.status(400).json({ message: "Email is required" });

  console.log(`Fetching cart for user: ${email}`);

  db.query(
    `SELECT 
        c.product_id AS id,
        c.product_name AS name,
        c.product_image AS image,
        c.quantity,
        c.price, 
        p.image AS product_image,
        p.originalPrice,
        p.discountedPrice,
        c.custom_text,
        c.photo
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      results.forEach(item => {
        item.price = parseFloat(item.price);
        item.originalPrice = parseFloat(item.originalPrice) || 0;
        item.discountedPrice = parseFloat(item.discountedPrice) || item.price;

        try {
                  item.image = JSON.parse(item.image);
                  if (!Array.isArray(item.image)) {
                    item.image = [item.image];
                  }
                } catch (e) {
                  item.image = [item.image]; // fallback for malformed data
                }

        // Parse custom_text
        if (item.custom_text) {
          try {
            item.custom_text = JSON.parse(item.custom_text);
          } catch {}
        }

        // Convert photo blob to base64
        if (item.photo) {
          item.photo = item.photo.toString("base64");
        }
      });

      console.log("Cart data retrieved (final):", results);
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
        workbook = xlsx.readFile(FILE_NAME);
    } else {
        workbook = xlsx.utils.book_new();
    }

    let worksheet;
    if (workbook.SheetNames.includes('Contacts')) {
        worksheet = workbook.Sheets['Contacts'];
    } else {
        worksheet = xlsx.utils.aoa_to_sheet([['Full Name', 'Email', 'Subject', 'Message']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    }

    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push([fullName, email, subject, message]);
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);

    workbook.Sheets['Contacts'] = newWorksheet;

    xlsx.writeFile(workbook, FILE_NAME);

    res.status(200).json({ message: 'Contact saved successfully' });
});

// POST feedback
app.post("/api/feedback", (req, res) => {
  const { user_id, name, email, rating, message } = req.body;

  if (!name || !email || !rating || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO feedback (user_id, name, email, rating, message) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [user_id || null, name, email, rating, message], (err, result) => {
    if (err) {
      console.error("Error saving feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Feedback submitted successfully" });
  });
});


app.post('/api/join-us', (req, res) => {
    const { fullName, email, contact, subject, message } = req.body;

    if (!fullName || !email || !contact || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let workbook;
    if (fs.existsSync(FILE_NAME2)) {

        workbook = xlsx.readFile(FILE_NAME2);
    } else {

        workbook = xlsx.utils.book_new();
    }

    let worksheet;
    if (workbook.SheetNames.includes('Sell On OceanWays')) {
        worksheet = workbook.Sheets['Sell On OceanWays'];
    } else {
        worksheet = xlsx.utils.aoa_to_sheet([['Full Name', 'Email', 'Contact' , 'Subject', 'Message']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sell On OceanWays');
    }

    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.push([fullName, email, contact,  subject, message]);
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);

    workbook.Sheets['Sell On OceanWays'] = newWorksheet;

    xlsx.writeFile(workbook, FILE_NAME2);

    res.status(200).json({ message: 'Contact saved successfully' });
});

// Razorpay 
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/api/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  });


app.post("/api/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, 
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save Order 
app.post("/api/save-order", (req, res) => {
  const { email, cartItems, amount, paymentStatus, paymentId, address } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Prepare products JSON safely
  let productsJson;
  try {
    productsJson = JSON.stringify(
      cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        custom_text: item.custom_text || null,
        photo: item.photo || null
      }))
    );
  } catch (err) {
    console.error("Error serializing products:", err);
    return res.status(400).json({ message: "Invalid products format" });
  }

  const insertOrder = `
    INSERT INTO orders 
    (first_name, last_name, email, phone, address, city, state, pin_code, country, amount, payment_status, payment_id, products)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertOrder,
    [
      address.first_name,
      address.last_name,
      email,
      address.phone,
      address.address,
      address.city,
      address.state,
      address.pin_code,
      address.country,
      Number(amount) || 0,
      paymentStatus,
      paymentId,
      productsJson
    ],
    (err, result) => {
      if (err) {
        console.error("Order insert failed:", err);
        return res.status(500).json({ message: "Failed to save order" });
      }

      // Clear cart after placing order
      db.query("DELETE FROM cart WHERE user_email = ?", [email], (err2) => {
        if (err2) {
          console.error("Failed to clear cart:", err2);
          return res.status(500).json({ message: "Order saved but cart not cleared" });
        }

        res.json({ message: "Order placed successfully", orderId: result.insertId });
      });
    }
  );
});



// Get
app.get("/api/orders/:email", (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `SELECT * FROM orders WHERE email = ? ORDER BY id DESC`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error fetching orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    if (results.length === 0) {
      return res.json([]);
    }

    // Fetch all product images
    db.query("SELECT id, image FROM products", (err2, productRows) => {
      if (err2) {
        console.error("Failed to fetch product images:", err2);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }

      // Create productId → image lookup
      const productMap = {};
      productRows.forEach(pr => {
        try {
          // if stored as JSON array ["img1.webp", "img2.webp"]
          const parsed = JSON.parse(pr.image);
          productMap[pr.id] = Array.isArray(parsed) ? parsed[0] : pr.image;
        } catch {
          productMap[pr.id] = pr.image;
        }
      });

      // Build orders with products
      const orders = results.map(order => {
        let products = [];

        try {
          const parsed = typeof order.products === "string" 
            ? JSON.parse(order.products) 
            : order.products;
          products = Array.isArray(parsed) ? parsed : [];
        } catch {
          products = [];
        }

        // Attach product image
        products = products.map(p => ({
          ...p,
          image: productMap[p.product_id] || null,
        }));

        return {
          id: order.id,
          first_name: order.first_name,
          last_name: order.last_name,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          state: order.state,
          pin_code: order.pin_code,
          country: order.country,
          amount: Number(order.amount) || 0,
          payment_status: order.payment_status,
          payment_id: order.payment_id,
          created_at: order.created_at || null,
          products,
        };
      });

      res.json(orders);
    });
  });
});


//Admin Dashboard
// API: Get all users
app.get("/api/users", (req, res) => {
  const sql = "SELECT id, email FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.json(results);
  });
});

// API: Export users to Excel
app.get("/api/users/export", async (req, res) => {
  const sql = "SELECT id, email FROM users";

  db.query(sql, async (err, results) => {
    if (err) {
      console.error("Error fetching users for export:", err);
      return res.status(500).send("Failed to export users");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Email", key: "email", width: 30 },
    ];

    worksheet.addRows(results);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  });
});

// GET all orders
app.get("/api/orders", (req, res) => {
  const query = "SELECT * FROM orders ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    const orders = results.map(order => {
      let products = [];

      try {
        if (typeof order.products === "string") {
          // Case: stored as string (TEXT or VARCHAR)
          products = JSON.parse(order.products || "[]");
        } else if (Array.isArray(order.products)) {
          // Case: MySQL JSON column (already parsed by MySQL driver)
          products = order.products;
        } else {
          products = [];
        }
      } catch (e) {
        console.error("Error parsing products for order:", order.id, e);
        products = [];
      }

      return {
        id: order.id,
        user_email: order.user_email || order.email, // handles both column names
        amount: Number(order.amount) || 0,
        payment_status: order.payment_status,
        created_at: order.created_at,
        products,
      };
    });

    res.json(orders);
  });
});

app.delete("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;

  const query = "DELETE FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json({ message: "Failed to delete order" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  });
});



// Export to Excel
app.get("/api/orders/export", async (req, res) => {
  const query = `
    SELECT o.id, o.first_name, o.last_name, o.user_email, p.name AS product, o.quantity, o.total, o.order_date
    FROM orders o
    JOIN products p ON o.product_id = p.id
    ORDER BY o.order_date DESC
  `;

  db.query(query, async (err, orders) => {
    if (err) {
      console.error("Error exporting orders:", err);
      return res.status(500).send("Error exporting orders.");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "First Name", key: "first_name", width: 20},
      { header: "Last Name", key: "last_name", width: 20},
      { header: "User Email", key: "user_email", width: 30 },
      { header: "Product", key: "product", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Total", key: "total", width: 15 },
      { header: "Order Date", key: "order_date", width: 20 },
    ];

    orders.forEach((order) => worksheet.addRow(order));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  });
});

// Add product
app.post('/api/products', (req, res) => {
  const p = req.body;
  const query = `INSERT INTO products
    (name, rating, reviews, originalPrice, discountedPrice, image, material, style, trending,
     customisable, giftingguide, type, theme, gift, text1, photo, size, luxury, description, personalisedJewellary, comingSoon, instruction, wallart)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    p.name, p.rating, p.reviews, p.originalPrice, p.discountedPrice, JSON.stringify(p.image),
    p.material, p.style, p.trending, p.customisable, JSON.stringify(p.giftingguide),
    JSON.stringify(p.type), JSON.stringify(p.theme), p.gift, p.text1,
    p.photo, p.size, p.luxury, p.description, p.personalisedjewellary, p.comingSoon, JSON.stringify(p.instruction), p.wallart
  ], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Product added successfully!' });
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);

    const safeParse = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value; // fallback: return as-is if not JSON
      }
    };

    const products = results.map(row => ({
      ...row,
      image: safeParse(row.image),
      type: safeParse(row.type),
      theme: safeParse(row.theme),
      giftingguide: safeParse(row.giftingguide),
      instruction: safeParse(row.instruction)
    }));

    res.send(products);
  });
});

//Update products
const ensureJsonArray = (value) => {
  if (Array.isArray(value)) return JSON.stringify(value);
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify([]);
  }
};

app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const p = req.body;

  const query = `
    UPDATE products
    SET 
      name = ?, rating = ?, reviews = ?, originalPrice = ?, discountedPrice = ?, image = ?, 
      material = ?, style = ?, trending = ?, customisable = ?, giftingguide = ?, type = ?, 
      theme = ?, gift = ?, text1 = ?, photo = ?, size = ?, luxury = ?, description = ?, 
      personalisedJewellary = ?, comingSoon = ?, instruction = ?, wallart = ?
    WHERE id = ?
  `;

  db.query(query, [
    p.name, p.rating, p.reviews, p.originalPrice, p.discountedPrice, ensureJsonArray(p.image),
    p.material, p.style, p.trending, p.customisable, ensureJsonArray(p.giftingguide),
    ensureJsonArray(p.type), ensureJsonArray(p.theme), p.gift, p.text1,
    p.photo, p.size, p.luxury, p.description, p.personalisedJewellary, p.comingSoon,
    ensureJsonArray(p.instruction), p.wallart, id
  ], (err, result) => {
    if (err) {
      console.error('Error updating product:', err.sqlMessage);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully!' });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Product deleted successfully!' });
  });
});

app.get('/api/products/slug/:slug', (req, res) => {
  const slug = decodeURIComponent(req.params.slug);

  db.query('SELECT * FROM products WHERE slug = ?', [slug], (err, results) => {
    if (err) {
      console.error("Error fetching product by slug:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const parseToArray = (value) => {
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      if (typeof value === 'string') {
        // If it looks like [1. Add..., 2. Add...] but without quotes
        let cleaned = value
          .replace(/^\[|\]$/g, '') // remove surrounding brackets
          .replace(/\r?\n|\r/g, ' ') // remove line breaks
          .trim();

        // Split on number-dot pattern OR commas
        const parts = cleaned.split(/\s*\d+\.\s*/).filter(Boolean);
        if (parts.length > 1) return parts.map(s => s.trim());

        return cleaned.includes(',')
          ? cleaned.split(',').map(s => s.trim())
          : [cleaned];
      }
      return [value];
    }
  };


    const product = {
      ...results[0],
      image: parseToArray(results[0].image),
      type: parseToArray(results[0].type),
      theme: parseToArray(results[0].theme),
      giftingguide: parseToArray(results[0].giftingguide),
      instruction: parseToArray(results[0].instruction),
    };

    res.json(product);
  });
});

// Bestseller products
app.get("/api/products/featured", (req, res) => {
  db.query("SELECT * FROM products WHERE id IN (1, 5, 9, 15)", (err, results) => {
    if (err) {
      console.error("Error fetching featured products:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.json(results);
  });
});

app.get("/api/products/:category/:subcategory", (req, res) => {
  const { category, subcategory } = req.params;

  // Map lowercase to original case
  const subcategoryMap = {
    // style
      modern: "Modern",
      vintage: "Vintage",
      bohemian: "Bohemian",
      traditional: "Traditional",
      transitional: "Transitional",
      earthy: "Earthy",
      wood: "Wood",
      acrylic: "Acrylic",
      glass: "Glass",
      resin: "Resin",
      cotton: "Cotton",
      metal: "Metal",
      safari: "Safari",
      modernminimilast: "ModernMinimilast",
      wellness: "Wellness",
      officeessentials: "OfficeEssentials",
      styles: "style",
      materials: "material",
      themes: "theme",
      trend: "trending",
      coquette: "Coquette",
      softgirlaesthetic: "SoftGirlAesthetic",
      dopamine: "Dopamine",
  };

  const normalisedCategory = category.toLowerCase();
  const normalisedSubcategory = (subcategory || "").toLowerCase();
  const dbSubcategory = subcategoryMap[normalisedSubcategory];

  if (!dbSubcategory) {
    return res.status(400).json({ error: "Invalid subcategory" });
  }

  let query;
  let values;

  if (normalisedCategory === "material") {
    query = "SELECT * FROM products WHERE material = ?";
    values = [dbSubcategory];
  } else if (
    normalisedCategory === "style" ||
    normalisedCategory === "theme" ||
    normalisedCategory === "trending"
  ) {
    query = `SELECT * FROM products WHERE JSON_CONTAINS(${normalisedCategory}, '["${dbSubcategory}"]')`;
    values = [];
  } else {
    return res.status(400).json({ error: "Invalid category" });
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});


//customisable products filter only
app.get('/api/products/customisable', async (req, res) => {
  try {
    const [rows] = await promiseDb.query(
      "SELECT * FROM products WHERE customisable = TRUE"
    );
    res.json({ products: rows });
  } catch (error) {
    console.error("Error fetching customisable products:", error);
    res.status(500).json({ error: error.message });
  }
});

//personalised jewellary
app.get("/api/products/personalised", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM products WHERE personalisedJewellary = 1" // or TRUE depending on schema
    );
    res.json({ products: rows });
  } catch (error) {
    console.error("Error fetching personalised jewelry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Feedback
app.use("/api/feedback", feedbackRoutes);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


