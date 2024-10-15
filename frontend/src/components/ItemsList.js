import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data.data); // Assuming your data comes in this format
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items', error);
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/items', newItem);
      setItems([...items, response.data]);
      setNewItem({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding item', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const response = await axios.put(`http://localhost:5000/items/${id}`, updatedItem);
      setItems(items.map(item => (item._id === id ? response.data : item)));
    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Items List</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Add New Item Name"
          required
        />
        <input
          type="text"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          placeholder="Add New Item Description"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <input
              type="text"
              defaultValue={item.name}
              onBlur={(e) => updateItem(item._id, { ...item, name: e.target.value })}
            />
            <input
              type="text"
              defaultValue={item.description}
              onBlur={(e) => updateItem(item._id, { ...item, description: e.target.value })}
            />
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
