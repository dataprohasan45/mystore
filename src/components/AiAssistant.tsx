import React, { useState } from 'react';
import { Language } from '../types';
import { Bot, Send, X, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface AiAssistantProps {
  lang: Language;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: isBn
        ? 'আসসালামু আলাইকুম! আমি "My Store Site" এর এআই অ্যাসিস্ট্যান্ট। পণ্যের দাম, ডিসকাউন্ট অফার, ৩ নং কিরাটন ইউনিয়নের হোম ডেলিভারি বা আপনার পছন্দের পণ্য সম্পর্কে যেকোনো প্রশ্ন করুন!'
        : 'Hello! I am My Store Site AI Assistant. Ask me about product prices, upcoming offers, delivery across Kiraton UP, or suggest new products!',
    },
  ]);

  const quickQuestions = isBn
    ? [
        'কখন নতুন অফার আসবে?',
        'কোন প্রোডাক্টের কি দাম?',
        '৩ নং কিরাটন ৩ নং ওয়ার্ডে ডেলিভারি কেমন?',
        'বিকাশ ও নগদে পেমেন্ট কীভাবে করব?',
      ]
    : [
        'When will new offers arrive?',
        'What are the product prices?',
        'How is delivery in Kiraton UP?',
        'How to pay via bKash/Nagad?',
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, lang }),
      });

      if (!res.ok) {
        throw new Error('Server response error');
      }

      const data = await res.json();
      const aiReply = data.reply || (isBn ? 'দুঃখিত, পুনরায় চেষ্টা করুন।' : 'Sorry, please try again.');
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      // Graceful offline fallback
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: isBn
            ? 'আমাদের স্টোরে বিভিন্ন অফার চলছে! ৩ নং কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ডে নিজস্ব ডেলিভারি টিম কাজ করছে এবং বিকাশ/নগদে ১০০% নিরাপদ পেমেন্ট সুবিধা রয়েছে।'
            : 'We offer great discounts and rapid delivery across Karimganj & Kiraton UP with secure bKash and Nagad payment options.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-tr from-green-700 via-green-800 to-red-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-yellow-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="font-black text-xs sm:text-sm tracking-wide hidden sm:inline">
            {isBn ? 'এআই স্টোর অ্যাসিস্ট্যান্ট' : 'Store AI Assistant'}
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-600/30 w-[92vw] sm:w-96 max-h-[550px] flex flex-col overflow-hidden text-gray-950 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 via-green-900 to-red-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-black text-sm leading-tight">
                  {isBn ? 'মাই স্টোর এআই সহকারী' : 'My Store AI Assistant'}
                </h4>
                <p className="text-[10px] text-green-200">
                  {isBn ? 'দাম, অফার ও এলাকা ডেলিভারি গাইড' : 'Prices, offers & delivery guide'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-gray-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-green-700 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span>{isBn ? 'এআই উত্তর তৈরি করছে...' : 'Thinking...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="p-2 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] bg-white hover:bg-green-50 text-gray-700 hover:text-green-800 border border-gray-300 px-2 py-1 rounded-full transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isBn ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
