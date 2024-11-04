const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
    host: process.env.DB_HOST,          
    user: process.env.DB_USER,          
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

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// API for select
app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM deva";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error retrieving data");
        } else {
            res.send(result);
        }
    });
});

// API for insert
app.post("/api/post", (req, res) => {
    const {name, email, contact} = req.body;
    const sqlInsert = "INSERT INTO deva (name, email, contact) VALUES (?, ?, ?)";
    db.query(sqlInsert, [name, email, contact], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error inserting data");
        } else {
            res.send("Data inserted successfully");
        }
    });
});

// API for delete
app.delete("/api/remove/:id", (req, res) => {
    const {id} = req.params;
    const sqlRemove = "DELETE FROM deva WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error deleting data");
        } else {
            res.send("Data deleted successfully");
        }
    });
});

// Get data for update
app.get("/api/get/:id", (req, res) => {
    const {id} = req.params;
    const sqlGet = "SELECT * FROM deva WHERE id = ?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error retrieving data");
        } else {
            res.send(result);
        }
    });
});

// Update API
app.put("/api/update/:id", (req, res) => {
    const {id} = req.params;
    const {name, email, contact} = req.body;
    const sqlUpdate = "UPDATE deva SET name = ?, email = ?, contact = ? WHERE id = ?";
    db.query(sqlUpdate, [name, email, contact, id], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error updating data");
        } else {
            res.send("Data updated successfully");
        }
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Export the app for serverless deployment
module.exports = app;
