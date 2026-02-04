
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse, generateSpeech, decode, decodeAudioData } from '../services/gemini';
import { ChatMessage } from '../types';

interface AITutorPanelProps {
  context?: string;
  isFloating?: boolean;
}

const AITutorPanel: React.FC<AITutorPanelProps> = ({ context: initialContext, isFloating = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeContext, setActiveContext] = useState(initialContext || 'Neuroanatomy • Cardiology History');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass performance and history context string
      const fullContext = `Current Topic: ${activeContext}. User has watched 45% of Anatomy videos. Weak in: Nerve pathways.`;
      const response = await getAIResponse(textToSend, fullContext);
      
      let type: ChatMessage['type'] = 'general';
      if (response.toLowerCase().includes('mnemonic:')) type = 'mnemonic';
      else if (response.toLowerCase().includes('explanation:')) type = 'explanation';
      else if (response.toLowerCase().includes('clue:')) type = 'clinical_clue';

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || 'Sorry, I encountered an error.',
        timestamp: Date.now(),
        type,
        isExpanded: true
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

  const toggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input after a delay
      setTimeout(() => {
        setInput('Generate a mnemonic for cranial nerves I to VI');
        setIsListening(false);
      }, 2000);
    }
  };

  const suggestions = [
    { label: 'Explain last MCQ', prompt: 'Can you explain the last question I got wrong in the Neuroanatomy quiz?' },
    { label: 'Mnemonic: CN Nerves', prompt: 'Give me a fun mnemonic for the cranial nerves.' },
    { label: 'Clinical correlation', prompt: 'What is the clinical correlation for a lesion in the Optic Chiasm?' },
  ];

  const renderMessageContent = (m: ChatMessage) => {
    if (m.role === 'user') return <p>{m.text}</p>;

    switch (m.type) {
      case 'mnemonic':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-2 py-1 rounded w-fit">
              <i className="fa-solid fa-lightbulb"></i> Mnemonic Aid
            </div>
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 italic text-slate-700">
              {m.text}
            </div>
          </div>
        );
      case 'explanation':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-oneui-blue font-black text-[10px] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded w-fit">
              <i className="fa-solid fa-graduation-cap"></i> Concept Breakdown
            </div>
            <div className="prose prose-sm text-slate-800 leading-relaxed">
              {m.text}
            </div>
          </div>
        );
      case 'clinical_clue':
        return (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 border-l-4">
            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Clinical High-Yield</h4>
            <p className="text-sm font-medium text-slate-800">{m.text}</p>
          </div>
        );
      default:
        return <p className="leading-relaxed">{m.text}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-oneui-bg relative overflow-hidden">
      {/* 1. Header with Context Chip */}
      <div className="oneui-header-space flex flex-col justify-end px-8 pb-4">
        <h1 className="text-4xl font-light text-slate-900 leading-tight">AI Medical<br/><span className="font-bold">Consultant</span></h1>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Focus:</span>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-1.5 h-1.5 bg-oneui-blue rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-600">{activeContext}</span>
          </div>
        </div>
      </div>

      {/* 2. Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-48 pt-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-white rounded-samsung shadow-sm mx-auto flex items-center justify-center text-3xl text-oneui-blue border border-slate-50">
              <i className="fa-solid fa-brain"></i>
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-900">Personalized Tutoring</p>
              <p className="text-xs text-slate-500 px-12 leading-relaxed">I'm aware of your study progress. Ask me to explain concepts from your last video or generate mnemonics for hard topics.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center px-6 mt-4">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s.prompt)}
                  className="bg-white px-4 py-2 rounded-full border border-slate-100 text-[11px] font-bold text-oneui-blue shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[88%] rounded-samsung px-6 py-5 shadow-sm transition-all ${
              m.role === 'user' 
                ? 'bg-oneui-blue text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <div className="text-[15px] font-medium">
                {renderMessageContent(m)}
              </div>
              
              {m.role === 'model' && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => speakText(m.text)}
                    className="h-10 px-4 bg-slate-50 border border-slate-100 text-oneui-blue rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wider active:scale-90 transition-all"
                  >
                    <i className={`fa-solid ${isSpeaking ? 'fa-spinner fa-spin' : 'fa-volume-high'}`}></i>
                    {isSpeaking ? 'Speaking...' : 'Read Aloud'}
                  </button>
                  <button className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center active:scale-90 transition-all">
                    <i className="fa-solid fa-share-nodes text-xs"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-samsung px-6 py-5 flex gap-2 border border-slate-100 shadow-sm">
              <div className="w-2 h-2 bg-oneui-blue rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-oneui-blue rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-oneui-blue rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Specialized Input Container (One UI Bottom Pattern) */}
      <div className="absolute bottom-24 left-0 right-0 px-5 pointer-events-none">
        <div className="max-w-[430px] mx-auto space-y-4 pointer-events-auto">
          {/* Listening Overlay */}
          {isListening && (
            <div className="bg-oneui-blue/95 backdrop-blur-md p-6 rounded-samsung flex items-center justify-between text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1 items-end h-6">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-1 bg-white rounded-full animate-pulse`} style={{height: `${Math.random()*100}%`, animationDelay: `${i*0.1}s`}}></div>
                    ))}
                  </div>
                  <p className="font-bold">Listening...</p>
               </div>
               <button onClick={toggleListen} className="text-white/60"><i className="fa-solid fa-xmark"></i></button>
            </div>
          )}

          <div className="bg-white rounded-samsung shadow-2xl border border-slate-100 p-2 flex gap-2 items-center transition-all focus-within:ring-4 focus-within:ring-blue-50">
            <button 
              onClick={toggleListen}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isListening ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'
              }`}
            >
              <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for clues or mnemonics..."
              className="flex-1 h-12 px-2 text-slate-800 focus:outline-none font-bold text-sm bg-transparent"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !isListening)}
              className="w-12 h-12 bg-oneui-blue text-white rounded-2xl flex items-center justify-center hover:scale-95 transition-transform disabled:opacity-30 shadow-lg shadow-blue-100"
            >
              <i className="fa-solid fa-paper-plane text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorPanel;
