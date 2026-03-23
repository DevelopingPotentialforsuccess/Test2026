// @ts-nocheck
/* eslint-disable */

import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [session, setSession] = useState(null);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user = {
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '_')}@local.dpss`
    };

    localStorage.setItem('session', JSON.stringify(user));
    setSession(user);
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      // SAFE fallback (no external dependency crash)
      const fakeResult = `Generated Test for: ${topic}`;
      setContent(fakeResult);
    } catch (e) {
      alert('Error generating');
    }

    setLoading(false);
  };

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
        <form onSubmit={handleLogin}>
          <h2>Enter Name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: 10, marginTop: 10 }}
          />
          <br />
          <button style={{ marginTop: 10, padding: 10 }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {session.name}</h1>

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
        style={{ width: '100%', height: 100, marginTop: 20 }}
      />

      <br />

      <button onClick={handleGenerate} style={{ marginTop: 10, padding: 10 }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      <div style={{ marginTop: 20 }}>
        <pre>{content}</pre>
      </div>
    </div>
  );
}

export default App;
