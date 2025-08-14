const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
require("dotenv").config();

// 1. Create DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// GET top 4 highest-rated feedbacks
router.get("/top", (req, res) => {
  const sql = `
    SELECT name, message, rating
    FROM feedback
    ORDER BY rating DESC
    LIMIT 4
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
