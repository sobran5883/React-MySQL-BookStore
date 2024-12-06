import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("https://react-mysql-bookstore.onrender.com/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("https://react-mysql-bookstore.onrender.com/books/" + id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Book Shop</h1>
      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && (
              <img
              src={book.cover}
              alt={book.title}
              style={{ width: "150px", height: "200px" }}
          />
          
            )}
            <h2>{book.title}</h2>
            <p>{book.description}</p>
            <span>{book.price}</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>
              Delete
            </button>
            <button className="update">
              <Link to={`/update/${book.id}`}>Update</Link>
            </button>
          </div>
        ))}
      </div>
      <button>
        <Link to="/add">Add New Book</Link>
      </button>
    </div>
  );
}

export default Books;