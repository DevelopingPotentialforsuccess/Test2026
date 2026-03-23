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
    // FIX: This regex removes all hidden characters and spaces, making 'dpss' work every time.
    const cleanCode = loginCode.toLowerCase().replace(/\s+/g, '');
    
    if (['virtues', 'gratitude', 'dpss'].includes(cleanCode)) {
      const email = `${loginName.toLowerCase().replace(/\s+/g, '_')}@local.dpss`;
      const s = { name: loginName, code: cleanCode, loginTime: Date.now(), email };
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
              <input type="password" value={loginCode} onChange={(e) => setLoginCode(e.target.value)} placeholder="Access Code" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outli
