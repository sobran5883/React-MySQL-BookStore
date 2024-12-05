import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Update() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];

  const [book, setBook] = useState({
    title: "",
    description: "",
    price: null,
    cover: "",
  });

  // Fetch current book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/books/${bookId}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBook((prev) => ({
        ...prev,
        cover: reader.result,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/book/${bookId}`, book);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Update the Book</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={book.title || ""}
          onChange={handleChange}
          name="title"
        />
        <input
          type="text"
          placeholder="Description"
          value={book.description || ""}
          onChange={handleChange}
          name="description"
        />
        <input
          type="number"
          placeholder="Price"
          value={book.price || ""}
          onChange={handleChange}
          name="price"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {book.cover && (
          <img
            src={book.cover}
            alt="Current Cover"
            style={{ width: "150px", height: "200px", marginTop: "10px" }}
          />
        )}
      </div>
      <button onClick={handleClick}>Update</button>
    </div>
  );
}

export default Update;
