const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection((error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Successfully connected to the database.");
    }
});

// Middleware
app.use(cors({
    origin: '*', // Adjust this for production to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API for select
app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM deva";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching data:", error);
            return res.status(500).send("Error fetching data");
        }
        res.send(result);
    });
});

// API for insert
app.post("/api/post", (req, res) => {
    const { name, email, contact } = req.body;
    const sqlInsert = "INSERT INTO deva (name, email, contact) VALUES (?, ?, ?)";
    db.query(sqlInsert, [name, email, contact], (error, result) => {
        if (error) {
            console.error("Error inserting data:", error);
            return res.status(500).send("Error inserting data");
        }
        res.send("Data inserted successfully");
    });
});

// API for delete
app.delete("/api/remove/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM deva WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
        if (error) {
            console.error("Error removing data:", error);
            return res.status(500).send("Error removing data");
        }
        res.send("Data removed successfully");
    });
});

// Get data to update API
app.get("/api/get/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM deva WHERE id = ?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.error("Error fetching data for update:", error);
            return res.status(500).send("Error fetching data");
        }
        res.send(result);
    });
});

// Update API
app.put("/api/update/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, contact } = req.body;
    const sqlUpdate = "UPDATE deva SET name = ?, email = ?, contact = ? WHERE id = ?";
    db.query(sqlUpdate, [name, email, contact, id], (error, result) => {
        if (error) {
            console.error("Error updating data:", error);
            return res.status(500).send("Error updating data");
        }
        res.send("Data updated successfully");
    });
});

// API for health check
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 4050; // Use PORT from environment variables or default to 4050
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export for potential testing
module.exports = db.promise();
module.exports = app;
