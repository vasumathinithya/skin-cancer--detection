
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doctors } from '../data/doctors';
import { Calendar, MapPin, Star, User, Clock, CheckCircle, X, Download, AlertTriangle, FileText, Search, Navigation, ArrowLeft } from 'lucide-react';
import { generateReport } from '../utils/reportGenerator';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const diagnosisData = location.state?.diagnosis;
    const diagnosisImage = location.state?.image;

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });

    // Search and Location State
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    // Filter doctors based on search and location
    const filteredDoctors = doctors.filter(doc => {
        const query = searchQuery.toLowerCase();

        let matchesSearch = true;

        if (query) {
            matchesSearch = doc.name.toLowerCase().includes(query) ||
                doc.specialty.toLowerCase().includes(query) ||
                doc.location.toLowerCase().includes(query) ||
                (doc.treatments && doc.treatments.some(t => t.toLowerCase().includes(query))); // Search by treatment
        }

        // If userLocation is set, strict filter by that city
        const matchesLocation = userLocation ? doc.location.toLowerCase().includes(userLocation.toLowerCase()) : true;

        return matchesSearch && matchesLocation;
    });

    const detectLocation = () => {
        setIsLocating(true);
        // Clear manual search when detecting location to show local results
        setSearchQuery('');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Mock Reverse Geocoding for Demo
                    setTimeout(() => {
                        const mockCities = ["Coimbatore", "Chennai", "Bangalore", "Mumbai"];
                        const detectedCity = "Coimbatore";
                        setUserLocation(detectedCity);
                        setIsLocating(false);
                    }, 1500);
                },
                (error) => {
                    console.error("Error detecting location:", error);
                    setIsLocating(false);
                    alert("Could not detect location. Please enable location permissions or enter manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setIsLocating(false);
        }
    };

    // Handle manual search input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // When user types in search, reset userLocation to empty string
        setUserLocation('');
    };

    const handleBook = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setBookingSuccess(true);
            // Auto-close removed to allow report download
        }, 1000);
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center text-slate-500 hover:text-blue-500 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                Find Specialized Care
            </h1>
            <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">
                Connect with top-rated dermatologists near you. Book instant appointments for your skin health needs.
            </p>

            {/* Search and Location Filter Bar */}
            <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search doctors, specialties, treatments, or city..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 shadow-sm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <button
                    onClick={detectLocation}
                    className="btn btn-secondary flex items-center justify-center bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    disabled={isLocating}
                >
                    <Navigation size={20} className={`mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? "Locating..." : "Use My Location"}
                </button>
            </div>

            {userLocation && (
                <div className="text-center mb-6">
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        <MapPin size={14} className="mr-1" /> Doctors near <strong>{userLocation}</strong>
                        <button onClick={() => setUserLocation('')} className="ml-2 text-blue-400 hover:text-blue-600"><X size={14} /></button>
                    </span>
                </div>
            )}

            {diagnosisData && (
                <div className={`mb-12 max-w-3xl mx-auto p-4 rounded-xl border ${diagnosisData.isUrgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} flex items-start shadow-sm`}>
                    <div className={`p-2 rounded-full mr-4 ${diagnosisData.isUrgent ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Consultation for: {diagnosisData.disease.name}</h3>
                        <p className="text-slate-600 text-sm">
                            {diagnosisData.isUrgent
                                ? "Your condition has been flagged as potentially serious. We recommend booking an appointment with a specialist immediately."
                                : "Based on your analysis, you may want to consult a doctor for further advice and treatment."}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="glass-card bg-white flex flex-col items-center text-center p-6 hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 relative overflow-hidden">
                        {doctor.name.includes("Hospital") && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                HOSPITAL
                            </div>
                        )}
                        <div className="relative w-full h-48 mb-4 bg-slate-100 rounded-xl overflow-hidden">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-cover shadow-sm transition-transform duration-500 hover:scale-110"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = doctor.name.includes("Hospital")
                                        ? "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop"
                                        : "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg";
                                }}
                            />
                            <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${doctor.available ? 'bg-green-500/90' : 'bg-red-500/90'}`}>
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                {doctor.available ? "Available" : "Busy"}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-1">{doctor.name}</h3>
                        <p className="text-blue-500 font-medium text-sm mb-3 uppercase tracking-wide">{doctor.specialty}</p>

                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {doctor.treatments && doctor.treatments.slice(0, 3).map((t, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-200">
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="w-full flex justify-center gap-4 text-slate-500 text-sm mb-6">
                            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {doctor.location.split(',')[0]}</span>
                            <span className="flex items-center text-yellow-500"><Star size={14} className="mr-1 fill-current" /> {doctor.rating}</span>
                        </div>

                        <div className="mt-auto w-full">
                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                disabled={!doctor.available}
                                className={`btn w-full py-3 rounded-xl font-semibold shadow-md ${doctor.available ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                {doctor.available ? t('app.book_appointment') : 'Not Available'}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <p className="text-xl mb-4">No doctors found matching your search.</p>

                        <div className="flex flex-col items-center gap-4">
                            <a
                                href={`https://www.google.com/maps/search/hospitals+near+${searchQuery || userLocation || 'me'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary flex items-center"
                            >
                                <MapPin className="mr-2" size={20} /> Search Hospitals on Google Maps
                            </a>

                            <button onClick={() => { setSearchQuery(''); setUserLocation(''); }} className="text-blue-500 hover:underline">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-md relative animate-fade-in">
                        <button
                            onClick={() => setSelectedDoctor(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        {bookingSuccess ? (
                            <div className="text-center py-10">
                                <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('app.success')}</h3>
                                <p className="text-slate-400">
                                    Dr. {selectedDoctor.name} has received your request.<br />
                                    We will send a confirmation SMS shortly.
                                </p>

                                <div className="mt-8 pt-6 border-t border-slate-700">
                                    <h4 className="text-lg font-semibold text-pink-400 mb-3 uppercase tracking-wide">Next Step</h4>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Please generate your medical report to present to the doctor.
                                    </p>

                                    <button
                                        onClick={() => {
                                            const reportDiagnosis = diagnosisData || {
                                                disease: { name: "General Consultation", symptoms: [], remedies: [] },
                                                category: "General",
                                                confidence: "N/A",
                                                severity: "Routine",
                                                isUrgent: false
                                            };

                                            generateReport(reportDiagnosis, diagnosisImage, {
                                                doctor: selectedDoctor.name,
                                                location: selectedDoctor.location,
                                                date: formData.date || new Date().toLocaleDateString(),
                                                time: formData.time || "Pending confirmation",
                                                patientName: formData.name || "Patient"
                                            });
                                        }}
                                        className="btn btn-secondary w-full flex items-center justify-center py-4 text-lg shadow-lg hover:bg-slate-700"
                                    >
                                        <FileText className="mr-2" size={20} /> Generate Medical Report
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleBook}>
                                <h3 className="text-2xl font-bold text-white mb-6 pr-8">Book with {selectedDoctor.name}</h3>

                                <div className="form-group">
                                    <label className="text-sm text-slate-400 mb-2 block">Patient Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            required
                                            className="pl-10"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="text-sm text-slate-400 mb-2 block">Phone Number</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                        <input
                                            type="tel"
                                            required
                                            className="pl-10"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="text-sm text-slate-400 mb-2 block">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-sm text-slate-400 mb-2 block">Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full mt-4">
                                    {t('app.confirm')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointment;
