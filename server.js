// Import required modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json()); // Parse JSON bodies

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    process.exit(1); // Exit process if connection fails
  }
  console.log('Connected to the database.');
});

// Utility function to handle database queries
const queryDB = (query, params, res) => {
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Add a default route for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital API. Use /patients, /providers, or search endpoints.');
});

// Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  queryDB(query, [], res);
});

// Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  queryDB(query, [], res);
});

// Filter patients by first name
app.get('/patients/search', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  queryDB(query, [req.query.first_name], res);
});

// Retrieve providers by specialty
app.get('/providers/search', (req, res) => {
  const query = 'SELECT first_name, last_name FROM providers WHERE provider_specialty = ?';
  queryDB(query, [req.query.provider_specialty], res);
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
