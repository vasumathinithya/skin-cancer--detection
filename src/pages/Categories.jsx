
import React from 'react';
import { Link } from 'react-router-dom';
import { diseaseCategories } from '../data/diseases';
import { ArrowRight, Activity, Zap, Beaker, Shield, Sun, Eye, Scissors, HeartPulse, Search, HelpCircle } from 'lucide-react';

const icons = [
    Shield, // 1 Infectious (Shield = protection)
    Activity, // 2 Inflammatory (Activity = immune response)
    Zap, // 3 Acne (Zap = clear skin)
    Sun, // 4 Pigmentation (Sun = cause)
    Beaker, // 5 Genetic (Science/DNA)
    Shield, // 6 Autoimmune (Shield again)
    Scissors, // 7 Hair/Scalp
    HeartPulse, // 8 Nail (Pulse = health check)
    Search, // 9 Tumors (Search/Scan)
    Beaker, // 10 Other
    HelpCircle // 11 General
];

const Categories = () => {
    return (
        <div className="min-h-screen py-16 px-4 bg-slate-50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
                        Select <span className="text-blue-600">Problem Area</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Choose the category that best describes your symptom location or type to enable specialized AI detection.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {diseaseCategories.map((category, index) => {
                        const Icon = icons[index % icons.length];
                        return (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="glass-card bg-white hover:border-blue-400 hover:shadow-xl group relative overflow-hidden block transition-all duration-300 transform hover:-translate-y-1"
                                style={{ textDecoration: 'none' }}
                            >
                                {/* Background Decorative Icon */}
                                <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
                                    <Icon size={180} className="text-blue-900" />
                                </div>

                                <div className="relative z-10">
                                    <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-100 transition-colors shadow-sm">
                                        <Icon className="text-blue-600 group-hover:text-blue-700" size={32} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>

                                    <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                                        {category.description}
                                    </p>

                                    <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform uppercase tracking-wide">
                                        Explore & Detect <ArrowRight size={16} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Categories;
