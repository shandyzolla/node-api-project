import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddItem from './components/AddItem';
import UpdateItem from './components/UpdateItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddItem />} />
        <Route path="/update/:id" element={<UpdateItem />} />
      </Routes>
    </Router>
  );
}

export default App;
