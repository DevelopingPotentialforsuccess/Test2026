// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { callNeuralEngine } from './services/neuralService';
import { exportToWord } from './services/wordExportService';
import Worksheet from './components/Worksheet';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { THEMES } from './constants';

const USER_SESSION_KEY = 'dp_session_v46';

function App() {

  const [session, setSession] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  });

  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [viewMode, setViewMode] = useState('generator');

  // ✅ LOGIN FIXED (100% consistent)
  const handleLogin = (e: any) => {
    e.preventDefault();

    const code = loginCode.trim().toLowerCase();

    if (code === 'dpss' || code === 'virtues' || code === 'gratitude') {

      if (!loginName.trim()) {
        setLoginError('Enter name');
        return;
      }

      const email =
        loginName.trim().toLowerCase().replace(/\s+/g, '_') + '@local.dpss';

      const s = {
        name: loginName.trim(),
        email,
        loginTime: Date.now()
      };

      setSession(s);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(s));
      setLoginError('');

    } else {
      setLoginError('Invalid code');
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
        'GEMINI_3_FLASH',
        topic,
        'Protocol',
        null,
        {}
      );

      if (!result || !result.text) throw new Error();

      setContent(result.text);
      setViewMode('preview');

    } catch (e) {
      console.error(e);
      alert('Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const header =
      '<table style="width:100%"><tr><td><b>Teacher:</b> ' +
      (session?.name || '') +
      '</td><td style="text-align:right;"><b>' +
      topic +
      '</b></td></tr></table>';

    exportToWord(content, 'Test', header, '0.6cm');
  };

  // ✅ LOGIN SCREEN
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            placeholder="Name"
          />
          <input
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            placeholder="Code"
          />
          <button type="submit">Login</button>
          <div>{loginError}</div>
        </form>
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <div className="p-10">

      {viewMode === 'preview' ? (
        <>
          <button onClick={() => setViewMode('generator')}>Back</button>
          <button onClick={handleExport}>Export</button>

          <Worksheet
            content={content}
            onContentChange={setContent}
            isGenerating={isGenerating}
            theme={THEMES?.[0] || {}}
            paperType="Plain"
            brandSettings={{}}
            level={'Level 1'}
            module={'Grammar'}
            topic={topic}
          />
        </>
      ) : (
        <>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
          />

          <button onClick={handleGenerate}>
            {isGenerating ? 'Loading...' : 'Generate'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
