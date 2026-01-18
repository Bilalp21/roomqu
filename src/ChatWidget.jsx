
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useSite } from './SiteContext';
import { HOTELS } from './data';

// Configuration
const MODEL_NAME = "gemini-2.0-flash-exp"; // Model yang terbukti ditemukan (walau sempat limit)

export default function ChatWidget() {
    const { siteName, chatEnabled } = useSite();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState(null);
    const [systemPrompt, setSystemPrompt] = useState('');
    const messagesEndRef = useRef(null);

    // If Chat is disabled via Admin Panel, don't render anything
    if (chatEnabled === false) return null;

    // Fetch API Key & Prompt from localStorage
    useEffect(() => {
        const storedKey = localStorage.getItem('geminiApiKey');
        const storedPrompt = localStorage.getItem('geminiSystemPrompt');

        if (storedKey) setApiKey(storedKey);

        const hotelContext = HOTELS.map(h =>
            `- ${h.name} (${h.location}): Rp ${h.price}, Rating ${h.rating}, Vendor: ${h.vendor}`
        ).join('\n');

        const defaultPrompt = `Kamu adalah asisten virtual untuk ${siteName}. Jawablah dengan ramah dan membantu.
        Berikut adalah data hotel yang tersedia:
        ${hotelContext}
        
        Jika user bertanya tentang hotel, gunakan data di atas. Jika tidak ada di data, katakan tidak tahu.`;

        setSystemPrompt(storedPrompt ? `${storedPrompt}\n\nData Hotel:\n${hotelContext}` : defaultPrompt);
    }, [isOpen, siteName]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const cleanApiKey = apiKey?.trim();

        if (!cleanApiKey) {
            setMessages(prev => [...prev, { text: "Maaf, API Key belum diatur. Silakan hubungi admin.", sender: 'bot' }]);
            setInputText('');
            return;
        }

        const userMsg = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Inisialisasi SDK Google Gen AI
            const ai = new GoogleGenAI({ apiKey: cleanApiKey });

            // Format history agar sesuai dengan spesifikasi model terbaru
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            // Menggabungkan System Prompt dan pesan user saat ini
            const contents = [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: `Halo! Saya asisten ${siteName}. Ada yang bisa saya bantu?` }]
                },
                ...history,
                {
                    role: "user",
                    parts: [{ text: userMsg.text }]
                }
            ];

            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: contents,
                config: {
                    temperature: 0.7
                }
            });

            const reply = response.text();

            if (reply) {
                setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
            } else {
                throw new Error("No response content from API");
            }

        } catch (error) {
            console.error("Chat SDK Error:", error);

            let errorMessage = "Maaf, terjadi kesalahan.";
            const errorText = error.message || error.toString();
            // Parse JSON error jika ada
            let detailError = errorText;
            try {
                if (errorText.includes('{')) {
                    const parsed = JSON.parse(errorText.substring(errorText.indexOf('{')));
                    if (parsed.error?.message) detailError = parsed.error.message;
                }
            } catch (e) { }

            if (detailError.includes('429')) {
                errorMessage = "⚠️ Quota Habis: Limit penggunaan API gratis Anda telah tercapai. Tunggu beberapa saat.";
            } else if (detailError.includes('404')) {
                errorMessage = `⚠️ Model Tidak Ditemukan: Model '${MODEL_NAME}' tidak tersedia untuk API Key ini. Coba ganti model di kode.`;
            } else if (detailError.includes('403')) {
                errorMessage = "⚠️ Akses Ditolak: API Key tidak valid atau tidak memiliki izin.";
            } else if (detailError.includes('400')) {
                errorMessage = "⚠️ Bad Request: Format pesan tidak diterima oleh model.";
            } else {
                errorMessage += ` (${detailError.substring(0, 100)}...)`;
            }

            setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 group"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[80vh] md:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asisten {siteName}</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        <div className="flex justify-center my-4">
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                                Hari ini
                            </span>
                        </div>

                        {/* Welcome Message */}
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Halo! 👋 Saya asisten pintar {siteName}. Tanyakan apa saja tentang hotel, harga, atau rekomendasi liburan!
                                </p>
                            </div>
                        </div>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-1 
                                    ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3.5 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed
                                    ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Tanya rekomendasi hotel..."
                                className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputText.trim()}
                                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md active:scale-95"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                        <div className="flex justify-center mt-2">
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Sparkles size={10} />
                                Powered by Bilal
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
