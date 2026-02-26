const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new appointment
router.post('/', async (req, res) => {
    const appointment = new Appointment({
        patientName: req.body.patientName,
        patientEmail: req.body.patientEmail,
        doctorName: req.body.doctorName,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location
    });

    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
