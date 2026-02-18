
import React from 'react';
import Hero from '../components/Hero';
import { Camera, FileText, Stethoscope, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page min-h-screen">
            <Hero />

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Simple Process</span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Get a professional-grade skin analysis in just three simple steps using our advanced AI technology.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-blue-100 -z-10"></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Camera className="text-blue-600" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Upload Image</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Take a clear photo of the affected skin area or upload an existing image from your gallery.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FileText className="text-indigo-600" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">2. AI Analysis</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our AI instantly analyzes textures and patterns to identify potential conditions with high accuracy.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Stethoscope className="text-emerald-600" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Consult Doctor</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Receive a detailed report and instantly book an appointment with a nearby specialist.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Ready to check your skin health?
                    </h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Don't wait. Early detection is key to effective treatment. Start your free AI analysis today.
                    </p>
                    <Link to="/detect" className="btn btn-primary text-xl px-10 py-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                        Analyze Now <ArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
