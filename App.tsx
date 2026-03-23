// @ts-nocheck
/* eslint-disable */
import {
  NeuralEngine,
  AcademicLevel,
  HistoryItem,
  QuickSource,
  StrictRule,
  SettingsTab,
  UserSession,
  BrandSettings,
  InstructionTemplate,
  Priority,
  RuleCategory,
  ExternalKeys,
  ChatMessage,
  AnswerStrategy
} from './types';
import {
  INITIAL_MODULES,
  LANGUAGES,
  ACADEMIC_LEVELS,
  GLOBAL_STRICT_COMMAND,
  DEFAULT_STRICT_RULES,
  DEFAULT_MASTER_PROTOCOLS,
  INITIAL_TEMPLATES,
  THEMES
} from './constants';
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { callNeuralEngine } from './services/neuralService';
import { exportToWord } from './services/wordExportService';
import React, { useState, useEffect, useRef } from 'react';
import Worksheet from './components/Worksheet';
import NeuralChatAssistant from './components/NeuralChatAssistant';
import { OnboardingTutorial } from './components/OnboardingTutorial';

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 0,
  textTransform: 'none',
  schoolName: 'DPSS ULTIMATE TEST BUILDER',
  schoolAddress: 'Developing Potential for Success School',
  logos: Array(30).fill(''),
  logoWidth: 300,
  logoData: ''
};

const MASTER_PROTOCOLS_KEY = 'dp_master_v46';
const STRICT_RULES_KEY = 'dp_rules_v46';
const HISTORY_KEY = 'dp_history_v46';
const BRAND_SETTINGS_KEY = 'dp_brand_v46';
const USER_SESSION_KEY = 'dp_session_v46';
const ENGINE_CONFIG_KEY = 'dp_engine_config_v46';
const ONBOARDING_KEY = 'dp_onboarding_v1';
const TEMPLATES_KEY = 'dp_templates_v46';

function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [viewMode, setViewMode] = useState<'generator' | 'preview' | 'book_creation' | 'ielts_master' | 'dpss_studio' | 'grammar_iframe'>('grammar_iframe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('Grammar');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 1');
  const [answerStrategy, setAnswerStrategy] = useState<AnswerStrategy>('GENERAL_MIXED');
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dp_theme_v30');
      return saved || 'default';
    } catch { return 'default'; }
  });

  const [activeEngine, setActiveEngine] = useState<NeuralEngine>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      return saved ? JSON.parse(saved).active : NeuralEngine.GEMINI_3_FLASH;
    } catch { return NeuralEngine.GEMINI_3_FLASH; }
  });

  const [externalKeys, setExternalKeys] = useState<ExternalKeys>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      return saved ? JSON.parse(saved).keys : {};
    } catch { return {}; }
  });

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    try {
      const saved = localStorage.getItem(BRAND_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_BRAND_SETTINGS;
    } catch { return DEFAULT_BRAND_SETTINGS; }
  });

  const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  const loadedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      setIsBrandLoaded(false);
      if (session?.email) {
        try {
          const docSnap = await getDoc(doc(db, 'user_settings', session.email));
          if (docSnap.exists() && docSnap.data().brandSettings) {
            setBrandSettings(docSnap.data().brandSettings);
          }
          loadedEmailRef.current = session.email;
        } catch (e) { console.error(e); } finally { setIsBrandLoaded(true); }
      } else { setIsBrandLoaded(true); }
    };
    fetchBrand();
  }, [session?.email]);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (session?.email) {
      const fetchHistory = async () => {
        try {
          const q = query(collection(db, 'generatedTests'), where('authorEmail', '==', session.email), orderBy('timestamp', 'desc'), limit(30));
          const snap = await getDocs(q);
          const h: HistoryItem[] = [];
          snap.forEach((d) => h.push(d.data() as HistoryItem));
          if (h.length > 0) setHistory(h);
        } catch (e) { console.error(e); }
      };
      fetchHistory();
    }
  }, [session?.email]);

  const [masterProtocols, setMasterProtocols] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(MASTER_PROTOCOLS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MASTER_PROTOCOLS;
    } catch { return DEFAULT_MASTER_PROTOCOLS; }
  });

  const [strictRules, setStrictRules] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(STRICT_RULES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STRICT_RULES;
    } catch { return DEFAULT_STRICT_RULES; }
  });

  const [instructionTemplates, setInstructionTemplates] = useState<InstructionTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    } catch { return INITIAL_TEMPLATES; }
  });

  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>([]);
  const [columnOverrides] = useState<Record<string, number>>({});
  const [itemCountOverrides] = useState<Record<string, number>>({});
  const [sourceMaterial] = useState<QuickSource | null>(null);
  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem(ONBOARDING_KEY) !== 'completed');

  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(instructionTemplates)); }, [instructionTemplates]);
  useEffect(() => { localStorage.setItem(STRICT_RULES_KEY, JSON.stringify(strictRules)); }, [strictRules]);
  useEffect(() => { localStorage.setItem(MASTER_PROTOCOLS_KEY, JSON.stringify(masterProtocols)); }, [masterProtocols]);

  useEffect(() => {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(brandSettings));
    if (session?.email && isBrandLoaded && loadedEmailRef.current === session.email) {
      setDoc(doc(db, 'user_settings', session.email), { brandSettings }, { merge: true }).catch(console.error);
    }
  }, [brandSettings, session?.email, isBrandLoaded]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
    document.documentElement.style.setProperty('--primary-orange', theme.color);
    document.body.style.backgroundColor = theme.bg;
  }, [activeThemeId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // This regex replaces all whitespace (including non-breaking spaces) to fix the login issue
    const sanitizedCode = loginCode.toLowerCase().replace(/\s/g, '');
    
    if (['virtues', 'gratitude', 'dpss'].includes(sanitizedCode)) {
      const email = `${loginName.toLowerCase().replace(/\s+/g, '_')}@local.dpss`;
      const s = { name: loginName, code: sanitizedCode, loginTime: Date.now(), email };
      setSession(s);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(s));
    } else { 
      setLoginError('Invalid Access Code.'); 
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await callNeuralEngine(activeEngine, topic, "Protocol", sourceMaterial, externalKeys);
      setWorksheetContent(result.text);
      setViewMode('preview');
    } catch (e) { alert("Failed."); } finally { setIsGenerating(false); }
  };

  const handleExportWord = () => {
    const header = `<table style="width: 100%;"><tr><td><b>Teacher:</b> ${session?.name}</td><td style="text-align: right;"><b>${topic}</b></td></tr></table>`;
    exportToWord(worksheetContent, 'Test', header, '0.6cm');
  };

  const hardReset = () => { if (confirm("Reset?")) { localStorage.clear(); window.location.reload(); } };

  if (!session) {
    return (
      <div className="h-screen w-screen bg-[#0b1221] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[64px] p-12 text-center">
           <h1 className="text-2xl font-black mb-8 uppercase">DPSS Architect Login</h1>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-orange-500 font-bold" />
              <input type="password" value={loginCode} onChange={(e) => setLoginCode(e.target.value)} placeholder="Access Code" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-orange-500 font-bold" />
              {loginError && <p className="text-rose-500 text-xs font-black uppercase">{loginError}</p>}
              <button type="submit" className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black uppercase hover:brightness-110">Synchronize</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden text-slate-300 relative transition-all duration-500">
      {showOnboarding && <OnboardingTutorial onComplete={() => { setShowOnboarding(false); localStorage.setItem(ONBOARDING_KEY, 'completed'); }} />}
      {viewMode === 'generator' && (
        <>
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[#1f2937] flex flex-col lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-500`}>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {history.map(item => (<button key={item.id} onClick={() => { setWorksheetContent(item.content); setViewMode('preview'); }} className="w-full text-left p-4 rounded-2xl bg-[#111827] border border-[#1f2937]"><div className="text-[11px] font-bold text-slate-400 line-clamp-1">{item.title}</div></button>))}
            </div>
            <div className="p-6 border-t border-[#1f2937] space-y-2">
              <button onClick={() => setShowSettings(true)} className="w-full p-5 rounded-2xl bg-orange-600 text-white font-black uppercase text-[11px]">Architect Settings</button>
              <button onClick={() => { setSession(null); localStorage.removeItem(USER_SESSION_KEY); }} className="w-full p-4 text-slate-500 text-[9px] font-black uppercase">Logout</button>
            </div>
          </aside>
          <main className="flex-1 border-r border-[#1f2937] flex flex-col overflow-y-auto p-10">
            <div className="max-w-5xl mx-auto w-full space-y-12">
               <div><h1 className="text-3xl font-black uppercase text-white">DPSS Ultimate Test Builder</h1><span className="text-orange-500 text-[9px] font-black uppercase tracking-widest block">Architect: {session.name}</span></div>
               <div className="flex bg-[#111827] p-2 rounded-2xl gap-1">
                 {INITIAL_MODULES.map(mod => (<button key={mod} onClick={() => { setActiveModule(mod); mod === 'Grammar' ? setViewMode('grammar_iframe') : setViewMode('generator'); }} className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase ${activeModule === mod ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>{mod}</button>))}
               </div>
               <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Target Topic..." className="w-full h-40 bg-[#111827] border border-[#1f2937] rounded-[40px] p-6 text-white outline-none focus:border-orange-500/50 resize-none font-medium" />
               <button onClick={handleGenerate} className="w-full bg-orange-600 text-white py-8 rounded-[40px] text-xl font-black uppercase shadow-2xl hover:brightness-110">{isGenerating ? 'Synthesizing...' : 'Synthesize Full Test'}</button>
            </div>
          </main>
        </>
      )}
      {viewMode === 'preview' && (
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1f2937] flex justify-between items-center bg-[#0b1221]">
            <button onClick={() => setViewMode('generator')} className="text-white px-8 py-3 rounded-full text-[11px] font-black uppercase border border-white/10">Architect</button>
            <button onClick={handleExportWord} className="px-10 py-3 bg-orange-600 text-white rounded-full text-[11px] font-black uppercase">Export DOC</button>
          </div>
          <div className="flex-1 overflow-y-auto"><Worksheet content={worksheetContent} onContentChange={setWorksheetContent} isGenerating={isGenerating} theme={THEMES[0]} paperType="Plain" brandSettings={brandSettings} level={activeLevel} module={activeModule} topic={topic} /></div>
        </section>
      )}
      {viewMode === 'grammar_iframe' && (
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[#1f2937] flex justify-between items-center bg-[#0b1221]">
            <button onClick={() => setViewMode('generator')} className="text-white px-8 py-3 rounded-full text-[11px] font-black uppercase border border-white/10">Architect</button>
            <h2 className="text-white font-black uppercase tracking-widest text-[12px]">Neural Grammar Architect</h2>
            <a href="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87" target="_blank" rel="noreferrer" className="px-6 py-3 bg-orange-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest">Launch Tool</a>
          </div>
          <iframe src="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87?showPreview=true" className="w-full h-full border-none" title="Grammar" />
        </section>
      )}
      {viewMode === 'book_creation' && (
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[#1f2937] flex justify-between items-center bg-[#0b1221]">
            <button onClick={() => setViewMode('generator')} className="text-white px-8 py-3 rounded-full text-[11px] font-black uppercase border border-white/10">Architect</button>
            <a href="https://remix-book-creation-4-deploy-370806846570.us-west1.run.app/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-orange-600 text-white rounded-full text-[11px] font-black uppercase">Launch Tool</a>
          </div>
          <iframe src="https://remix-book-creation-4-deploy-370806846570.us-west1.run.app/" className="w-full h-full border-none" title="Book" />
        </section>
      )}
      <button onClick={() => setIsAssistantVisible(!isAssistantVisible)} className="fixed bottom-6 right-6 h-16 w-16 rounded-full flex items-center justify-center text-white bg-slate-800 shadow-2xl transition-all"><i className={`fa-solid ${isAssistantVisible ? 'fa-xmark' : 'fa-wand-magic-sparkles text-xl'}`}></i></button>
      {showSettings && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] rounded-[48px] w-full max-w-7xl h-full max-h-[95vh] flex flex-col overflow-hidden border border-white/50 text-slate-900">
             <div className="p-8 flex justify-between items-center"><h2 className="text-[12px] font-black uppercase tracking-widest">Workspace Control</h2><button onClick={() => setShowSettings(false)} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button></div>
             <div className="flex-1 p-12"><p className="font-bold">Settings Panel Active</p></div>
             <div className="p-12 bg-slate-50 border-t flex justify-end gap-4">
                <button onClick={hardReset} className="px-16 py-6 bg-rose-600 text-white rounded-full text-[12px] font-black uppercase">Hard Reset</button>
                <button onClick={() => setShowSettings(false)} className="px-16 py-6 bg-orange-600 text-white rounded-full text-[12px] font-black uppercase">Close Panel</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
