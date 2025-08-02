const mysql = require('mysql2');
require("dotenv").config();

// 1. Create DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 2. Connect to DB and generate slugs
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to database');

  db.query('SELECT id, name FROM products', (err, results) => {
    if (err) throw err;

    results.forEach((product) => {
      const slug = generateSlug(product.name);

      db.query(
        'UPDATE products SET slug = ? WHERE id = ?',
        [slug, product.id],
        (err) => {
          if (err) {
            console.error(`❌ Failed to update product ID ${product.id}:`, err);
          } else {
            console.log(`✅ Slug updated for product ID ${product.id}: ${slug}`);
          }
        }
      );
    });
  });
});

// 3. Utility function to slugify product names
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-');          // Collapse multiple hyphens
}
