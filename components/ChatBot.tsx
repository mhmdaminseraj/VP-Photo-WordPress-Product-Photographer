
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage, ChatModel } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your WordPress Product Consultant. Need help brainstorming a title or improving your product presentation?' }
  ]);
  const [input, setInput] = useState('');
  // Updated: Set default model to gemini-3-flash-preview
  const [model, setModel] = useState<ChatModel>('gemini-3-flash-preview');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const stream = await chatWithGemini(userMessage, chatHistory, model);
      let fullResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        // Correctly using the .text property on the response chunk
        const text = chunk.text;
        fullResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Expert Consultant</h2>
          <p className="text-slate-500 mt-2">Get advice on your WordPress product's branding.</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-1 rounded-xl flex shadow-sm">
          <button
            onClick={() => setModel('gemini-3-flash-preview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              model === 'gemini-3-flash-preview' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            3 Flash
          </button>
          <button
            onClick={() => setModel('gemini-3-pro-preview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              model === 'gemini-3-pro-preview' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            3 Pro
          </button>
        </div>
      </header>

      <div className="flex-grow bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Message Container */}
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-5 py-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${model.includes('flash') ? 'Flash' : 'Pro'} expert...`}
            className="flex-grow px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${
              !input.trim() || isTyping 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
