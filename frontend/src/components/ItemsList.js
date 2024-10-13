import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemsList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/items')
        .then(response => {
            setItems(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data", error);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Items List</h1>
            <ul>
                {items.map(item => (
                    <li key={item._id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ItemsList;