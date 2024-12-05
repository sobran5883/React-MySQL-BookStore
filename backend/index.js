import express from "express";
import mysql from "mysql";
import cors from "cors";

const app=express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sobran",
    database: "test",
});

// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.get("/", (req, res)=>{
    res.json("hello this is the backend");
})

app.get("/books", (req, res)=>{
    const q = "SELECT * FROM books";
    db.query(q, (err, data)=>{
        if(err){
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.post("/books", (req, res) => {
    const { title, description, price, cover } = req.body;

    if (!title || !description || !price || !cover) {
        return res.status(400).json("All fields are required.");
    }

    const q = "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
    const values = [title, description, price, cover];

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json("Book has been created successfully");
    });
});


app.delete("/books/:id", (req, res)=>{
    const bookId= req.params.id;
    const q = " DELETE FROM books WHERE id = ?";

    db.query(q,[bookId], (err, data)=>{
        if(err){
            return res.send(err);
        }
        return res.json("book has been deleted successfull");
    })
})

app.put("/book/:id", (req, res)=>{
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`=?, `description`=?, `price`=?, `cover`=? where id=?";

    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q, [...values,bookId], (err,data)=>{
        if(err){
            return res.json(err);
        }
        return res.json("book had been updated successfully.");
    })
})

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
  

app.listen(8800, ()=>{
    console.log("connected to backend!")
})
