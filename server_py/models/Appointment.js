const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientEmail: String,
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: String,
    status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
