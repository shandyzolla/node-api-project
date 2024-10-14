import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemsList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', description: '' }); // Correctly initialize as an object

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get('http://localhost:5000/items')
            .then(response => {
                setItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching items', error);
                setLoading(false);
            });
    };

    // Handle changes to the name input
    const handleNameChange = (e) => {
        setNewItem((prevItem) => ({
            ...prevItem,
            name: e.target.value,
        }));
    };

    // Handle changes to the description input
    const handleDescriptionChange = (e) => {
        setNewItem((prevItem) => ({
            ...prevItem,
            description: e.target.value,
        }));
    };

    const addItem = (e) => {
        e.preventDefault();

        // Validate that both fields are not empty
        if (!newItem.name || !newItem.description) {
            alert('Please provide both name and description');
            return;
        }

        axios.post('http://localhost:5000/items', newItem)
            .then(response => {
                setItems([...items, response.data]);
                setNewItem({ name: '', description: '' }); // Reset form fields
            })
            .catch(error => {
                console.error('Error adding item', error);
            });
    };

    const deleteItem = (id) => {
        axios.delete(`http://localhost:5000/items/${id}`)
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => {
                console.error('Error deleting item', error);
            });
    };

    const updateItem = (id, updatedData) => {
        axios.put(`http://localhost:5000/items/${id}`, updatedData)
            .then(response => {
                const updatedItems = items.map(item => {
                    if (item._id === id) {
                        return { ...item, ...updatedData };
                    }
                    return item;
                });
                setItems(updatedItems);
            })
            .catch(error => {
                console.error('Error updating item', error);
            });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Items List</h1>

            {/* Form to add a new item */}
            <form onSubmit={addItem}>
                <input
                    type='text'
                    value={newItem.name}
                    onChange={handleNameChange}
                    placeholder='Add New Item Name'
                    required
                />
                <input
                    type='text'
                    value={newItem.description}
                    onChange={handleDescriptionChange}
                    placeholder='Add New Item Description'
                    required
                />
                <button type='submit'>Add Item</button>
            </form>

            {/* List of items */}
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        <input
                            type='text'
                            defaultValue={item.name}
                            onBlur={(e) => updateItem(item._id, { name: e.target.value })}
                        />
                        <input
                            type='text'
                            defaultValue={item.description}
                            onBlur={(e) => updateItem(item._id, { description: e.target.value })}
                        />
                        <button onClick={() => deleteItem(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemsList;
