import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader } from 'lucide-react';
import { getStoredKey, setStoredKey } from '../utils/gemini';

const QA_DATABASE = {
    // Basic Greetings
    "hi": "Hello! I'm DermaBot, your AI skin health assistant. You can switch to GenAI mode by adding an API key! 🤖",
    "hello": "Hi there! Feel free to ask me about skin conditions, symptoms, or finding a doctor.",
    "hey": "Hey! How can I assist you with your skin health concerns?",

    // App Features
    "tools": "This application is built using **React.js** for the frontend, **Vite** for fast building, and **Tailwind CSS** for styling. The AI model uses **TensorFlow.js** custom logic for image analysis.",
    "tech": "We use a modern tech stack: React, Vite, TailwindCSS, Lucide Icons, and specialized AI algorithms for dermatological image processing.",
    "ai": "Our AI uses computer vision techniques (pixel variance analysis, color histogramming) to classify skin lesions into 7-10 distinct categories.",

    // Locations
    "coimbatore": "We have several top-rated dermatologists in Coimbatore, including KMCH and GKNM Hospital. Check the 'Find Doctors' section for the full list.",
    "chennai": "In Chennai, we partner with Apollo Hospitals and leading specialists in T. Nagar and Adyar.",

    // General
    "help": "I can help you with information about skin diseases, symptoms, remedies, finding a doctor, or using this app. Just ask!",
    "thank": "You're welcome! Take care of your skin. Is there anything else I can help with?",
    "bye": "Goodbye! Stay healthy and don't forget your sunscreen!"
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hi! I'm DermaBot. I can answer questions about skin health using GenAI! 🤖" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [apiKey, setApiKey] = useState(getStoredKey());
    const [showKeyInput, setShowKeyInput] = useState(!apiKey);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Listen for storage changes to sync key if updated in Detector
    useEffect(() => {
        const handleStorage = () => setApiKey(getStoredKey());
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const saveApiKey = (key) => {
        setStoredKey(key);
        setApiKey(key);
        setShowKeyInput(false);
        setMessages(prev => [...prev, { type: 'bot', text: "Great! GenAI is now enabled. Ask me anything!" }]);
    };

    const callGenAI = async (query) => {
        const tryModel = async (modelName) => {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are DermaBot, a professional AI dermatologist. 
                            Answer clearly and concisely about skin health.
                            User: ${query}`
                        }]
                    }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        };

        try {
            // First try gemini-1.5-flash (standard free tier)
            return await tryModel('gemini-1.5-flash');
        } catch (error) {
            console.warn("Gemini 1.5 Flash failed, trying Pro...", error);
            try {
                // Fallback to gemini-pro (older stable free tier)
                return await tryModel('gemini-1.5-pro');
            } catch (fallbackError) {
                console.error("All Gemini models failed:", fallbackError);
                return `AI Error: ${fallbackError.message}. Please check your API Key.`;
            }
        }
    };

    const findBestMatch = async (query) => {
        const lowerQuery = query.toLowerCase();

        // 1. Check Local Database (for specific app info)
        for (const [key, value] of Object.entries(QA_DATABASE)) {
            if (lowerQuery.includes(key) && key.length > 3) return value;
        }

        // 2. Use GenAI if Key is present
        if (apiKey) {
            return await callGenAI(query);
        }

        // 3. Fallback
        return "To answer this question using GenAI, I need a Google Gemini API Key. Please click the 'Key' icon (top right of chat) to add it!";
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Simulate network/thinking delay
        const response = await findBestMatch(userMessage);

        setMessages(prev => [...prev, { type: 'bot', text: response }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="glass-card w-80 sm:w-96 mb-4 border border-slate-200 overflow-hidden animate-fade-in flex flex-col h-[500px] relative">
                    {/* Doctor Background Image with Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740"
                            alt="Doctor Background"
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-white/80"></div>
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">DermaBot AI</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-blue-100 flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                                        {apiKey ? 'Dr. AI Online' : 'Basic Mode'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowKeyInput(!showKeyInput)}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors text-xs border border-white/30 px-2"
                            >
                                {apiKey ? 'Key' : 'Add Key'}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* API Key Input Overlay */}
                    {showKeyInput && (
                        <div className="bg-slate-50 p-4 border-b border-slate-200 text-sm animate-fade-in relative z-10">
                            <p className="mb-2 text-slate-700 font-medium">Enter Google Gemini API Key for GenAI:</p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    placeholder="Paste API Key here..."
                                    className="flex-1 px-3 py-2 border rounded-lg text-xs"
                                    onKeyDown={(e) => { if (e.key === 'Enter') saveApiKey(e.target.value) }}
                                    onChange={(e) => setApiKey(e.target.value)} // Temporary local state for input
                                />
                                <button
                                    onClick={() => saveApiKey(apiKey)} // Save currently typed key
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                                Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 underline">Google AI Studio</a>.
                            </p>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white shadow-sm ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                                    {msg.type === 'user' ? <User size={16} /> : <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Dr" className="w-5 h-5" />}
                                </div>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white/95 text-slate-800 border border-slate-200/50 rounded-tl-none'
                                        }`}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white/90 border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white/90 border-t border-slate-200 relative z-10 backdrop-blur-md">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder={apiKey ? "Ask Dr. AI..." : "Add API Key to chat..."}
                                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 text-slate-800 text-sm placeholder:text-slate-400 shadow-inner"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold items-center justify-center">1</span>
                    </span>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
