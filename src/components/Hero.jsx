
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, UserPlus, PhoneIncoming } from 'lucide-react';

const Hero = () => {
    return (
        <section className="hero relative overflow-hidden py-16 md:py-24">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-white">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[100px] rounded-full opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 blur-[100px] rounded-full opacity-60"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
                <div className="inline-block py-1.5 px-4 rounded-full bg-blue-50 border border-blue-100 mb-8 shadow-sm">
                    <span className="text-sm font-bold text-blue-600 tracking-wide uppercase">New: AI Model v2.0 Released</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                    Your Personal <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                        Skin Health Guardian
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
                    Advanced AI detection for over 10 categories of skin patterns. From acne to complex conditions, get instant analysis and connect with top doctors near you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-20">
                    <Link to="/detect" className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all">
                        <Search className="mr-2" /> Start Free Analysis
                    </Link>
                    <Link to="/categories" className="btn btn-secondary text-lg px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600">
                        Explore Conditions
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    <div className="glass-card p-8 text-left bg-white border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-100 transition-colors">
                            <ShieldCheck className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">99% Accuracy</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Powered by advanced deep learning models trained on thousands of clinical dermatoscopic images for precise validation.
                        </p>
                    </div>

                    <div className="glass-card p-8 text-left bg-white border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="bg-emerald-50 p-4 rounded-2xl w-fit mb-6 group-hover:bg-emerald-100 transition-colors">
                            <UserPlus className="text-emerald-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Doctors</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Instantly locate and book appointments with top-rated dermatologists and hospitals in your city.
                        </p>
                    </div>

                    <div className="glass-card p-8 text-left bg-white border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="bg-indigo-50 p-4 rounded-2xl w-fit mb-6 group-hover:bg-indigo-100 transition-colors">
                            <PhoneIncoming className="text-indigo-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Care</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Receive immediate first-aid advice and over-the-counter remedy suggestions while you wait for your consultation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
