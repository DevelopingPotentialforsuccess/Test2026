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
  orderBy,
  limit
} from 'firebase/firestore';

import { callNeuralEngine } from './services/neuralService';
import { exportToWord } from './services/wordExportService';

import React, { useState, useEffect, useRef } from 'react';
import Worksheet from './components/Worksheet';
import { OnboardingTutorial } from './components/OnboardingTutorial';

const USER_SESSION_KEY = 'dp_session_v46';
const BRAND_SETTINGS_KEY = 'dp_brand_v46';
const HISTORY_KEY = 'dp_history_v46';
const ENGINE_CONFIG_KEY = 'dp_engine_config_v46';
const ONBOARDING_KEY = 'dp_onboarding_v1';

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

function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginName, setLoginName] = useState('');

  const [viewMode, setViewMode] = useState<'generator' | 'preview' | 'grammar_iframe'>('generator');
  const [topic, setTopic] = useState('');
  const [worksheetContent, setWorksheetContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeModule, setActiveModule] = useState('Grammar');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 1');

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== 'completed'
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginName.trim()) return;

    const email = `${loginName.toLowerCase().replace(/\s+/g, '_')}@local.dpss`;

    const sessionData: UserSession = {
      name: loginName,
      loginTime: Date.now(),
      email
    };

    setSession(sessionData);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await callNeuralEngine(
        NeuralEngine.GEMINI_3_FLASH,
        topic,
        'Protocol',
        null,
        {}
      );
      setWorksheetContent(result.text);
      setViewMode('preview');
    } catch {
      alert('Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportWord = () => {
    const header = `
      <table style="width:100%">
        <tr>
          <td><b>Teacher:</b> ${session?.name}</td>
          <td style="text-align:right;"><b>${topic}</b></td>
        </tr>
      </table>
    `;
    exportToWord(worksheetContent, 'Test', header, '0.6cm');
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-xl font-bold">Login</h1>

          <input
            type="text"
            placeholder="Enter your name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="p-3 text-black rounded"
          />

          <button className="bg-orange-600 px-6 py-3 rounded">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col text-white">

      {showOnboarding && (
        <OnboardingTutorial
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem(ONBOARDING_KEY, 'completed');
          }}
        />
      )}

      {viewMode === 'generator' && (
        <div className="p-6 space-y-6">

          <h1 className="text-2xl font-bold">
            DPSS Test Builder — {session.name}
          </h1>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className="w-full h-32 p-4 text-black"
          />

          <button
            onClick={handleGenerate}
            className="bg-orange-600 px-6 py-3 rounded"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {viewMode === 'preview' && (
        <div className="flex-1 flex flex-col">

          <div className="p-4 flex justify-between">
            <button onClick={() => setViewMode('generator')}>
              Back
            </button>

            <button onClick={handleExportWord}>
              Export DOC
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <Worksheet
              content={worksheetContent}
              onContentChange={setWorksheetContent}
              isGenerating={isGenerating}
              theme={THEMES[0]}
              paperType="Plain"
              brandSettings={brandSettings}
              level={activeLevel}
              module={activeModule}
              topic={topic}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
