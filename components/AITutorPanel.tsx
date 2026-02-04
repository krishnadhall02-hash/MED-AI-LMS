
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse, generateSpeech, decode, decodeAudioData } from '../services/gemini';
import { ChatMessage } from '../types';

interface AITutorPanelProps {
  context?: string;
  isFloating?: boolean;
}

const AITutorPanel: React.FC<AITutorPanelProps> = ({ context, isFloating = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(input, context);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || 'Sorry, I encountered an error.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64 = await generateSpeech(text);
      if (base64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const decoded = decode(base64);
        const buffer = await decodeAudioData(decoded, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (error) {
      console.error("Speech failed", error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-oneui-bg">
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-8">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">AI Medical<br/><span className="font-bold">Consultant</span></h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-24">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-white rounded-samsung shadow-sm mx-auto flex items-center justify-center text-3xl text-oneui-blue">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-900">How can I help you today?</p>
              <p className="text-sm text-slate-500 px-10">I can explain complex syndromes or help you with clinical diagnostics.</p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-samsung px-5 py-4 text-[15px] font-medium leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-oneui-blue text-white' : 'bg-white text-slate-800'
            }`}>
              <p>{m.text}</p>
              {m.role === 'model' && (
                <button 
                  onClick={() => speakText(m.text)}
                  className="mt-3 bg-slate-50 text-oneui-blue h-10 px-4 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider"
                >
                  <i className={`fa-solid ${isSpeaking ? 'fa-spinner fa-spin' : 'fa-volume-high'}`}></i>
                  Read Aloud
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-samsung px-6 py-4 flex gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-24 left-0 right-0 max-w-[430px] mx-auto px-5">
        <div className="bg-white rounded-samsung shadow-xl border border-slate-200 p-2 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 h-12 px-4 text-slate-800 focus:outline-none font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 bg-oneui-blue text-white rounded-2xl flex items-center justify-center hover:scale-95 transition-transform disabled:opacity-50 shadow-lg shadow-blue-100"
          >
            <i className="fa-solid fa-arrow-up text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorPanel;
