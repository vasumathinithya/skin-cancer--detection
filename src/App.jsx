
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import CategorizedDiseases from './pages/CategorizedDiseases';
import Detector from './pages/Detector';
import Appointment from './pages/Appointment';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategorizedDiseases />} />
            <Route path="/detect" element={<Detector />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="glass py-4 text-center mt-auto">
          <p className="text-muted">© 2024 Skin Cancer & Disease Detector AI. All rights reserved.</p>
        </footer>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
