
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Cannot connect to server. Make sure the backend is running.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-card p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={32} className="text-pink-500" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to access your health dashboard</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-6">
                        <label className="text-slate-300 mb-2 block font-medium">Email Address</label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="email" required className="pl-10 w-full" placeholder="name@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group mb-8">
                        <div className="flex justify-between mb-2">
                            <label className="text-slate-300 font-medium">Password</label>
                            <a href="#" className="text-sm text-pink-400 hover:text-pink-300">Forgot Password?</a>
                        </div>
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-3.5 text-slate-500" />
                            <input type="password" required className="pl-10 w-full" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="btn btn-primary w-full py-3 text-lg shadow-lg hover:shadow-pink-500/40">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8">
                    Don't have an account? <Link to="/register" className="text-pink-400 font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
