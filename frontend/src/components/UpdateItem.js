import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateItem() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${id}`);
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      console.error("Error fetching item", error);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/items/${id}`, { name, description });
      navigate('/');
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  return (
    <div>
      <h1>Update Item</h1>
      <form onSubmit={updateItem}>
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
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}

export default UpdateItem;
