import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Add() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    description: "",
    price: null,
    cover: "",
  });

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
      await axios.post("http://localhost:8800/books", book);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Add New Book</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          onChange={handleChange}
          name="title"
        />
        <input
          type="text"
          placeholder="Description"
          onChange={handleChange}
          name="description"
        />
        <input
          type="number"
          placeholder="Price"
          onChange={handleChange}
          name="price"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button onClick={handleClick}>Add</button>
    </div>
  );
}

export default Add;
