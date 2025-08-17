import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I'm your PizzaChain assistant! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message: currentInput })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const botReply = data.reply || "Sorry, I couldn't process that.";
            setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
            
        } catch (err) {
            const errorMessage = err.message.includes('Failed to fetch') 
                ? "⚠️ Cannot connect to server. Please check if the backend is running."
                : `⚠️ Error: ${err.message}`;
            setMessages(prev => [...prev, { sender: "bot", text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window - Only visible when open */}
            {isOpen && (
                <div className="fixed bottom-20 right-5 z-50 pointer-events-auto">
                    <div
                        className="
                            animate-in slide-in-from-bottom-5 fade-in duration-300
                            bg-white rounded-xl shadow-2xl w-80 h-[28rem] flex flex-col border border-gray-200
                        "
                    >
                        <div className="flex items-center justify-between p-3 bg-orange-500 text-white rounded-t-xl">
                            <h3 className="font-bold">PizzaChain Assistant</h3>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-xs word-wrap break-words ${
                                        msg.sender === 'user' 
                                            ? 'bg-orange-500 text-white rounded-br-none' 
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 flex items-center gap-2 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100"
                                placeholder="Ask a question..."
                                disabled={isLoading}
                            />
                            <button 
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chat Button - Always visible */}
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                        group relative
                        bg-gradient-to-r from-orange-500 to-red-600 text-white
                        h-16 w-16 rounded-full shadow-xl 
                        flex items-center justify-center
                        hover:scale-110 active:scale-95
                        transition-all duration-200 ease-out
                        focus:outline-none focus:ring-4 focus:ring-orange-500/50
                    "
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                    <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        {isOpen ? (
                            <X className="h-8 w-8" />
                        ) : (
                            <MessageSquare className="h-8 w-8" />
                        )}
                    </div>
                    
                    {/* Pulse animation when closed */}
                    {!isOpen && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-20 group-hover:opacity-40 animate-pulse"></div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                            {isOpen ? "Close chat" : "Need help?"}
                        </div>
                        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                    </div>
                </button>
            </div>
        </>
    );
};

export default ChatWidget;