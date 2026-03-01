
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, User, Activity, Globe, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const navLinks = [
        { name: "Home", path: '/' },
        { name: "Categories", path: '/categories' },
        { name: "AI Detector", path: '/detect' },
        { name: "Find Doctors", path: '/appointments' },
        { name: "Admin", path: '/admin', icon: LayoutDashboard },
    ];

    const user = localStorage.getItem('user');

    return (
        <nav className="glass sticky top-0 z-50 transition-all duration-300 border-b border-slate-200">
            <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 decoration-none group">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                        <Brain size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        DermaAI
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-semibold transition-colors duration-300 relative py-1 ${location.pathname === link.path
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-blue-600'
                                }`}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                            )}
                        </Link>
                    ))}

                    <div className="h-6 w-px bg-slate-200 mx-2"></div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group relative">
                        <Globe size={16} className="text-slate-500 group-hover:text-blue-500" />
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="bg-transparent text-slate-700 text-sm font-medium outline-none border-none cursor-pointer appearance-none pr-4"
                        >
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3 pl-4">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <User size={16} />
                                </div>
                                <span>{JSON.parse(user).name.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                                className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm px-6 shadow-lg shadow-blue-500/20">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-700 hover:text-blue-600 transition-colors p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-6 flex flex-col gap-4 animate-fade-in z-40">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-lg font-medium p-3 rounded-xl transition-colors ${location.pathname === link.path
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-slate-100 my-2"></div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 font-medium flex items-center gap-2">
                            <Globe size={18} /> Language
                        </span>
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            value={i18n.language}
                            className="bg-white border border-slate-200 text-slate-700 text-sm p-2 rounded-lg"
                        >
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>

                    {!user && (
                        <Link
                            to="/login"
                            className="btn btn-primary text-center mt-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Login / Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
