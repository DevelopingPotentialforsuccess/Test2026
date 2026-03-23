// @ts-nocheck
/* eslint-disable */
import {
  NeuralEngine,
  AcademicLevel,
  HistoryItem,
  QuickSource,
  StrictRule,
  UserSession,
  BrandSettings,
  InstructionTemplate,
  ExternalKeys,
  AnswerStrategy
} from './types';

import {
  INITIAL_MODULES,
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

const USER_SESSION_KEY = 'dp_session_v46';
const BRAND_SETTINGS_KEY = 'dp_brand_v46';
const HISTORY_KEY = 'dp_history_v46';
const ONBOARDING_KEY = 'dp_onboarding_v1';

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
  const [activeModule, setActiveModule] = useState<string>('Grammar');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 1');
  const [topic, setTopic] = useState('');
  const [worksheetContent, setWorksheetContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() =>
    safeParse(BRAND_SETTINGS_KEY, DEFAULT_BRAND_SETTINGS)
  );

  const [history, setHistory] = useState<HistoryItem[]>(() =>
    safeParse(HISTORY_KEY, [])
  );

  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== 'completed'
  );

  const loadedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!email) return;

      try {
        const docSnap = await getDoc(doc(db, 'user_settings', email));
        if (docSnap.exists() && docSnap.data().brandSettings) {
          setBrandSettings(docSnap.data().brandSettings);
        }
        loadedEmailRef.current = email;
      } catch (e) {
        console.error(e);
      }
    };

    fetchBrand();
  }, [email]);

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

        snap.forEach(d => h.push(d.data() as HistoryItem));
        h.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        setHistory(h);
      } catch (e) {
        console.error(e);
      }
    };

    fetchHistory();
  }, [email]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(brandSettings));

    if (email && loadedEmailRef.current === email) {
      setDoc(doc(db, 'user_settings', email), { brandSettings }, { merge: true })
        .catch(console.error);
    }
  }, [brandSettings, email]);

  useEffect(() => {
    const theme = THEMES?.[0] || { color: '#f97316', bg: '#0b1221' };
    document.documentElement.style.setProperty('--primary-orange', theme.color);
    document.body.style.backgroundColor = theme.bg;
  }, []);

  // ✅ FIXED LOGIN (consistent for ALL users)
  const handleLogin = (e: any) => {
    e.preventDefault();

    const code = loginCode.trim().toLowerCase();

    if (code === 'dpss' || code === 'virtues' || code === 'gratitude') {
      if (!loginName.trim()) {
        setLoginError('Enter your name');
        return;
      }

      const email = `${loginName.trim().toLowerCase().replace(/\s+/g, '_')}@local.dpss`;

      const s = {
        name: loginName.trim(),
        code,
        loginTime: Date.now(),
        email
      };

      setSession(s);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(s));
      setLoginError('');
    } else {
      setLoginError('Invalid Access Code');
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Enter topic');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await callNeuralEngine(
        NeuralEngine.GEMINI_3_FLASH,
        topic,
        "Protocol",
        null,
        {}
      );

      if (!result || !result.text) throw new Error();

      setWorksheetContent(result.text);
      setViewMode('preview');
    } catch {
      alert('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportWord = () => {
    const header = `<table style="width:100%">
      <tr>
        <td><b>Teacher:</b> ${session?.name}</td>
        <td style="text-align:right;"><b>${topic}</b></td>
      </tr>
    </table>`;

    exportToWord(worksheetContent, 'Test', header, '0.6cm');
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={loginName}
            onChange={e => setLoginName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={loginCode}
            onChange={e => setLoginCode(e.target.value)}
            placeholder="Code"
          />
          <button type="submit">Login</button>
          <div>{loginError}</div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen">

      {showOnboarding && (
        <OnboardingTutorial
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem(ONBOARDING_KEY, 'completed');
          }}
        />
      )}

      {viewMode === 'preview' ? (
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
      ) : (
        <div className="flex-1 p-10">
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Topic"
          />

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
