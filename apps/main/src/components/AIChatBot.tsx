import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Ek'abo! I'm your Lagos City Guide. Ask me anything about the best spots, culture, or tips for navigating the Gidi life!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      
      // Direct API call to avoid SDK loading issues in browser
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: userMessage }]
            }],
            systemInstruction: {
              parts: [{ text: "You are an expert Lagos city guide for the 'My Lagos Community' platform. You are helpful, energetic, and deeply knowledgeable about Lagos, Nigeria (history, culture, traffic, best restaurants, hidden gems, and local slang like 'Eko oni baje'). Keep responses concise, friendly, and formatted in clean Markdown. If asked about places, suggest specific areas like Victoria Island, Lekki, Ikeja, or Surulere where appropriate." }]
            }
          })
        }
      );

      const data = await response.json();
      
      let botText = "I'm sorry, I couldn't process that. Try asking about the best beaches or restaurants in Lagos!";
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
         botText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
         console.error("Gemini API Error:", data.error);
         botText = "Oshey! I'm having trouble connecting to the city grid right now. Please try again.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("AI Network Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Oshey! Something went wrong with my connection. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-50 bg-[#f59e0b] hover:bg-amber-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {/* Chat Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[60] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Header */}
        <div className="p-6 bg-[#111827] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">MLC City Guide</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Online Now</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${m.role === 'user' ? 'bg-blue-600' : 'bg-[#f59e0b]'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about Lagos..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f59e0b]/50 transition-all text-sm font-medium"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-[#f59e0b] text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-[#f59e0b] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center font-bold uppercase tracking-widest">
            Powered by Gemini AI • MLC Community Guide
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity"
        />
      )}
    </>
  );
};