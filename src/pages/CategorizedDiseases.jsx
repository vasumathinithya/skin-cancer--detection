
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { diseaseCategories } from '../data/diseases';
import { Camera, ChevronLeft, ArrowRight, Stethoscope } from 'lucide-react';

const CategorizedDiseases = () => {
    const { id } = useParams();
    const category = diseaseCategories.find(c => c.id === parseInt(id));

    if (!category) {
        return <div className="text-center py-20 text-slate-800">Category not found</div>;
    }

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <Link to="/categories" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium">
                <ChevronLeft size={20} className="mr-1" /> Back to Categories
            </Link>

            <div className="bg-white rounded-3xl p-8 mb-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Selected Category</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        {category.name}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        {category.description}
                    </p>
                </div>

                <Link
                    to={`/detect?cat=${category.id}`}
                    className="btn btn-primary px-10 py-5 text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all flex-shrink-0"
                >
                    <Camera className="mr-2" />
                    Detect Issues Now
                </Link>

                <Link
                    to={`/appointments?q=${encodeURIComponent(category.name)}`}
                    className="btn bg-white text-blue-600 border border-blue-200 px-8 py-5 text-lg shadow-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all flex-shrink-0 flex items-center"
                >
                    <Stethoscope className="mr-2" size={20} />
                    Find Specialists
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Common Conditions & Remedies</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {category.diseases.length} Found
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.diseases.map((disease, idx) => (
                    <div key={idx} className="glass-card bg-white p-6 relative overflow-hidden group hover:shadow-xl hover:border-blue-300 transition-all duration-300 border border-slate-100">
                        <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform rotate-12">
                            <Camera size={120} className="text-blue-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{disease.name}</h3>
                                {disease.type && (
                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                                        {disease.type}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl mb-6">
                                <p className="font-semibold text-slate-700 text-sm border-b border-slate-200 pb-2 mb-2">
                                    Recommended Treatments:
                                </p>
                                <ul className="space-y-2">
                                    {disease.remedies.map((remedy, i) => (
                                        <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span className="leading-snug">{remedy}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                                <span className="text-xs text-slate-500 font-medium">Have these symptoms?</span>
                                <Link
                                    to={`/detect?cat=${category.id}&disease=${encodeURIComponent(disease.name)}`}
                                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-blue-500/10 transition-colors"
                                >
                                    Check Now <ArrowRight size={14} className="ml-1" />
                                </Link>

                                <Link
                                    to={`/appointments?q=${encodeURIComponent(disease.name)}`}
                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg text-sm font-bold flex items-center transition-colors"
                                    title="Book Appointment"
                                >
                                    <Stethoscope size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorizedDiseases;
