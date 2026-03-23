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
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
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

const safeParse = (key: string, fallback: any) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [session, setSession] = useState<UserSession | null>(() =>
    safeParse(USER_SESSION_KEY, null)
  );

  const email = session?.email;

  const [viewMode, setViewMode] = useState<any>('grammar_iframe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('Grammar');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 1');
  const [answerStrategy, setAnswerStrategy] = useState<AnswerStrategy>('GENERAL_MIXED');
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const [activeThemeId, setActiveThemeId] = useState<string>(() =>
    localStorage.getItem('dp_theme_v30') || 'default'
  );

  const [activeEngine, setActiveEngine] = useState<NeuralEngine>(() => {
    const saved = safeParse(ENGINE_CONFIG_KEY, null);
    return saved?.active || NeuralEngine.GEMINI_3_FLASH;
  });

  const [externalKeys, setExternalKeys] = useState<ExternalKeys>(() => {
    const saved = safeParse(ENGINE_CONFIG_KEY, null);
    return saved?.keys || {};
  });

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() =>
    safeParse(BRAND_SETTINGS_KEY, DEFAULT_BRAND_SETTINGS)
  );

  const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  const loadedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      setIsBrandLoaded(false);
      if (email) {
        try {
          const docSnap = await getDoc(doc(db, 'user_settings', email));
          if (docSnap.exists() && docSnap.data().brandSettings) {
            setBrandSettings(docSnap.data().brandSettings);
          }
          loadedEmailRef.current = email;
        } catch (e) {
          console.error(e);
        } finally {
          setIsBrandLoaded(true);
        }
      } else {
        setIsBrandLoaded(true);
      }
    };
    fetchBrand();
  }, [email]);

  const [history, setHistory] = useState<HistoryItem[]>(() =>
    safeParse(HISTORY_KEY, [])
  );

  useEffect(() => {
    if (!email) return;

    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, 'generatedTests'),
          where('authorEmail', '==', email),
          limit(30)
        );

        const snap = await getDocs(q);
        const h: HistoryItem[] = [];

        snap.forEach((d) => h.push(d.data() as HistoryItem));

        h.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        setHistory(h);
      } catch (e) {
        console.error(e);
      }
    };

    fetchHistory();
  }, [email]);

  const [masterProtocols, setMasterProtocols] = useState<StrictRule[]>(() =>
    safeParse(MASTER_PROTOCOLS_KEY, DEFAULT_MASTER_PROTOCOLS)
  );

  const [strictRules, setStrictRules] = useState<StrictRule[]>(() =>
    safeParse(STRICT_RULES_KEY, DEFAULT_STRICT_RULES)
  );

  const [instructionTemplates, setInstructionTemplates] = useState<InstructionTemplate[]>(() =>
    safeParse(TEMPLATES_KEY, INITIAL_TEMPLATES)
  );

  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== 'completed'
  );

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(instructionTemplates));
  }, [instructionTemplates]);

  useEffect(() => {
    localStorage.setItem(STRICT_RULES_KEY, JSON.stringify(strictRules));
  }, [strictRules]);

  useEffect(() => {
    localStorage.setItem(MASTER_PROTOCOLS_KEY, JSON.stringify(masterProtocols));
  }, [masterProtocols]);

  useEffect(() => {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(brandSettings));

    if (email && isBrandLoaded && loadedEmailRef.current === email) {
      setDoc(doc(db, 'user_settings', email), { brandSettings }, { merge: true })
        .catch(console.error);
    }
  }, [brandSettings, email, isBrandLoaded]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === activeThemeId) || THEMES?.[0] || { color: '#f97316', bg: '#0b1221' };
    document.documentElement.style.setProperty('--primary-orange', theme.color);
    document.body.style.backgroundColor = theme.bg;
  }, [activeThemeId]);

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (loginCode.toLowerCase().trim() === 'dpss') {
      const email = `${loginName.toLowerCase().replace(/\s+/g, '_')}@local.dpss`;

      const s = {
        name: loginName,
        code: loginCode,
        loginTime: Date.now(),
        email
      };

      setSession(s);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(s));
    } else {
      setLoginError('Invalid Access Code. Use "dpss"');
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Enter topic");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await callNeuralEngine(
        activeEngine,
        topic,
        "Protocol",
        null,
        externalKeys
      );

      if (!result || !result.text) throw new Error("Bad response");

      setWorksheetContent(result.text);
      setViewMode('preview');
    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportWord = () => {
    const header = `<table style="width: 100%;"><tr><td><b>Teacher:</b> ${session?.name}</td><td style="text-align: right;"><b>${topic}</b></td></tr></table>`;
    exportToWord(worksheetContent, `Test`, header, '0.6cm');
  };

  const hardReset = () => {
    if (confirm("Reset?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <form onSubmit={handleLogin}>
          <input value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="Name" />
          <input value={loginCode} onChange={e => setLoginCode(e.target.value)} placeholder="Code" />
          <button type="submit">Login</button>
          {loginError}
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {viewMode === 'preview' && (
        <div className="flex-1">
          <button onClick={() => setViewMode('generator')}>Back</button>
          <button onClick={handleExportWord}>Export</button>
          <Worksheet
            content={worksheetContent}
            onContentChange={setWorksheetContent}
            isGenerating={isGenerating}
            theme={THEMES?.[0] || {}}
            paperType="Plain"
            brandSettings={brandSettings}
            level={activeLevel}
            module={activeModule}
            topic={topic}
          />
        </div>
      )}

      {viewMode !== 'preview' && (
        <div className="flex-1 p-10">
          <textarea value={topic} onChange={e => setTopic(e.target.value)} />
          <button onClick={handleGenerate}>
            {isGenerating ? 'Loading...' : 'Generate'}
          </button>

          <a
            href="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87"
            target="_blank"
          >
            Open Grammar Tool
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
