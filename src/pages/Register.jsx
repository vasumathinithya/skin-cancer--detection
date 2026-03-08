
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, User } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const res = await fetch(`${API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }
            localStorage.setItem('user', JSON.stringify({ name, email }));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Cannot connect to server. Make sure the backend is running.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-card p-8 animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">Join DermaAI</h2>
                    <p className="text-slate-400">Create your health profile today</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group mb-6">
                        <label className="text-slate-300 mb-2 block font-medium">Full Name</label>
                        <div className="relative">
                            <User size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="text" required className="pl-10 w-full" placeholder="Your Name"
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="text-slate-300 mb-2 block font-medium">Email Address</label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="email" required className="pl-10 w-full" placeholder="name@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group mb-8">
                        <label className="text-slate-300 font-medium">Password</label>
                        <div className="relative mb-4">
                            <Lock size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="password" required className="pl-10 w-full" placeholder="Create Password"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="password" required className="pl-10 w-full" placeholder="Confirm Password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="btn btn-primary bg-gradient-to-r from-emerald-500 to-green-600 w-full py-3 text-lg shadow-lg hover:shadow-emerald-500/40">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8">
                    Already have an account? <Link to="/login" className="text-emerald-400 font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
