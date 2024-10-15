import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/items', { name, description });
      navigate('/');
    } catch (error) {
      console.error("Error adding item", error);
    }
  };

  return (
    <div>
      <h1>Add New Item</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;
