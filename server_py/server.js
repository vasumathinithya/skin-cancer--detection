const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// --------------------------------------------------
// MongoDB Connection
// --------------------------------------------------

mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/skin_cancer_db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Backend is running!'
    });
});

// --------------------------------------------------
// Appointment Routes
// --------------------------------------------------

const appointmentRoutes = require('./routes/appointments');

app.use('/api/appointments', appointmentRoutes);

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});