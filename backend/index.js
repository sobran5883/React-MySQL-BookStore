import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

app.use(express.json({ limit: "500kb" })); // Set JSON payload limit to 500 KB
app.use(cors({
    origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Test the database connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database!");
    }
});

app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
});

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.json("Book has been created successfully");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.json("Book has been deleted successfully");
    });
});

app.put("/book/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`=?, `description`=?, `price`=?, `cover`=? WHERE id=?";

    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json("Book has been updated successfully");
    });
});

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data[0]); // Send the book object
    });
});

const port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
