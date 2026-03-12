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

// --- THE NEW FIREBASE MAGIC ---
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
// ------------------------------

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
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (e) { 
      return null; 
    }
  });

  const [authLoading, setAuthLoading] = useState(false);

  const [viewMode, setViewMode] = useState<'generator' | 'preview' | 'book_creation' | 'ielts_master' | 'dpss_studio' | 'grammar_iframe'>('grammar_iframe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('Grammar');
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 1');
  const [answerStrategy, setAnswerStrategy] = useState<AnswerStrategy>('GENERAL_MIXED');
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('COMMAND');
  
  const [activeLogicCategory, setActiveLogicCategory] = useState<RuleCategory>('General');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [activeProtocolCategory, setActiveProtocolCategory] = useState<RuleCategory>('General');
  const [expandedProtocolId, setExpandedProtocolId] = useState<string | null>(null);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('GRAMMAR');
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dp_theme_v30');
      if (saved) {
        return saved;
      }
      return 'default';
    } catch (e) { 
      return 'default'; 
    }
  });

  const [activeEngine, setActiveEngine] = useState<NeuralEngine>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.active;
      }
      return NeuralEngine.GEMINI_3_FLASH;
    } catch (e) { 
      return NeuralEngine.GEMINI_3_FLASH; 
    }
  });

  const [externalKeys, setExternalKeys] = useState<ExternalKeys>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.keys;
      }
      return {};
    } catch (e) { 
      return {}; 
    }
  });
  
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    try {
      const saved = localStorage.getItem(BRAND_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_BRAND_SETTINGS;
    } catch (e) { 
      return DEFAULT_BRAND_SETTINGS; 
    }
  });

  const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  const loadedEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBrandSettingsFromCloud = async () => {
      setIsBrandLoaded(false);
      loadedEmailRef.current = null;

      if (session && session.email) {
        try {
          const docRef = doc(db, 'user_settings', session.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.brandSettings) {
              setBrandSettings(data.brandSettings);
            }
          }
          loadedEmailRef.current = session.email;
        } catch (e) {
          console.error("Error fetching brand settings:", e);
        } finally {
          setIsBrandLoaded(true);
        }
      } else {
        setIsBrandLoaded(true);
      }
    };
    fetchBrandSettingsFromCloud();
  }, [session?.email]);
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch (e) { 
      return []; 
    }
  });

  const fetchCloudHistory = async (email: string) => {
    try {
      const q = query(
        collection(db, 'generatedTests'),
        where('authorEmail', '==', email),
        orderBy('timestamp', 'desc'),
        limit(30)
      );
      const querySnapshot = await getDocs(q);
      const cloudHistory: HistoryItem[] = [];
      querySnapshot.forEach((doc) => {
        cloudHistory.push(doc.data() as HistoryItem);
      });
      if (cloudHistory.length > 0) {
        setHistory(cloudHistory);
      }
    } catch (e) {
      console.error("Error fetching cloud history:", e);
    }
  };

  useEffect(() => {
    if (session && session.email) {
      fetchCloudHistory(session.email);
    }
  }, [session?.email]);

  const [masterProtocols, setMasterProtocols] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(MASTER_PROTOCOLS_KEY);
      let parsed = saved ? JSON.parse(saved) : DEFAULT_MASTER_PROTOCOLS;
      if (!Array.isArray(parsed)) {
        parsed = DEFAULT_MASTER_PROTOCOLS;
      }
      const existingIds = new Set(parsed.map((p: any) => p.id));
      const missing = DEFAULT_MASTER_PROTOCOLS.filter(p => !existingIds.has(p.id));
      return [...parsed, ...missing];
    } catch (e) { 
      return DEFAULT_MASTER_PROTOCOLS; 
    }
  });

  const [strictRules, setStrictRules] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(STRICT_RULES_KEY);
      let parsed = saved ? JSON.parse(saved) : DEFAULT_STRICT_RULES;
      if (!Array.isArray(parsed)) {
        parsed = DEFAULT_STRICT_RULES;
      }
      const existingIds = new Set(parsed.map((r: any) => r.id));
      const missing = DEFAULT_STRICT_RULES.filter(r => !existingIds.has(r.id));
      return [...parsed, ...missing];
    } catch (e) { 
      return DEFAULT_STRICT_RULES; 
    }
  });

  const [instructionTemplates, setInstructionTemplates] = useState<InstructionTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_KEY);
      let parsed = saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
      if (!Array.isArray(parsed)) {
        parsed = INITIAL_TEMPLATES;
      }
      const existingIds = new Set(parsed.map((t: any) => t.id));
      const missing = INITIAL_TEMPLATES.filter(t => !existingIds.has(t.id));
      return [...parsed, ...missing];
    } catch (e) { 
      return INITIAL_TEMPLATES; 
    }
  });

  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>([]);
  const [columnOverrides, setColumnOverrides] = useState<Record<string, number>>({});
  const [itemCountOverrides, setItemCountOverrides] = useState<Record<string, number>>({});
  
  const [sourceMaterial, setSourceMaterial] = useState<QuickSource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoUploadRef = useRef<HTMLInputElement>(null);

  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_KEY);
      if (saved === 'completed') {
        return false;
      }
      return true;
    } catch (e) { 
      return true; 
    }
  });

  useEffect(() => { 
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); 
    } catch (e) {
      console.warn("History storage limit reached.", e);
    }
  }, [history]);

  useEffect(() => { 
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(instructionTemplates)); 
    } catch (e) { 
      console.warn("Templates storage limit reached", e); 
    }
  }, [instructionTemplates]);

  useEffect(() => { 
    try {
      localStorage.setItem(STRICT_RULES_KEY, JSON.stringify(strictRules)); 
    } catch (e) { 
      console.warn("Rules storage limit reached", e); 
    }
  }, [strictRules]);

  useEffect(() => { 
    try {
      localStorage.setItem(MASTER_PROTOCOLS_KEY, JSON.stringify(masterProtocols)); 
    } catch (e) { 
      console.warn("Protocols storage limit reached", e); 
    }
  }, [masterProtocols]);

  useEffect(() => { 
    try {
      localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(brandSettings)); 
    } catch (e) {
      console.warn("Storage quota exceeded.", e);
    }
    
    const persistBrandSettings = async () => {
      if (session && session.email && isBrandLoaded && loadedEmailRef.current === session.email) {
        try {
          const docRef = doc(db, 'user_settings', session.email);
          await setDoc(docRef, { brandSettings: brandSettings }, { merge: true });
        } catch (e) {
          console.error("Error persisting brand settings:", e);
        }
      }
    };
    persistBrandSettings();
  }, [brandSettings, session?.email, isBrandLoaded]);

  useEffect(() => { 
    localStorage.setItem('dp_theme_v30', activeThemeId); 
    const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
    
    document.documentElement.style.setProperty('--primary-orange', theme.color);
    document.documentElement.style.setProperty('--accent-orange-light', theme.accent);
    document.documentElement.style.setProperty('--accent-orange-dark', theme.color);
    
    const body = document.body;
    if (theme.bg.startsWith('linear-gradient') || theme.bg.startsWith('radial-gradient')) {
      body.style.backgroundImage = theme.bg;
      body.style.backgroundColor = 'transparent';
    } else {
      body.style.backgroundColor = theme.bg;
      body.style.backgroundImage = 'none';
    }

    const isDark = theme.id === 'midnight' || theme.id === 'nebula';
    body.style.color = isDark ? '#f8fafc' : '#1e293b';
    
    const main = document.querySelector('main');
    const aside = document.querySelector('aside');
    if (main) {
      main.style.backgroundColor = isDark ? '#0b1221' : 'rgba(255, 255, 255, 0.4)';
      main.style.backdropFilter = 'blur(20px)';
    }
    if (aside) {
      aside.style.backgroundColor = isDark ? '#0b1221' : 'rgba(255, 255, 255, 0.6)';
      aside.style.backdropFilter = 'blur(20px)';
    }
  }, [activeThemeId]);

  useEffect(() => { 
    localStorage.setItem(ENGINE_CONFIG_KEY, JSON.stringify({ active: activeEngine, keys: externalKeys }));
  }, [activeEngine, externalKeys]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * THEMES.length);
      const randomTheme = THEMES[randomIndex];
      setActiveThemeId(randomTheme.id);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const cyclePriority = (current: Priority): Priority => {
    const priorities: Priority[] = ['Low', 'Average', 'Medium', 'High'];
    const currentIndex = priorities.indexOf(current);
    const nextIndex = (currentIndex + 1) % priorities.length;
    return priorities[nextIndex];
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = loginCode.toLowerCase().trim();
    const name = loginName.trim();
    if (!name) { 
      setLoginError('Full name is required.'); 
      return; 
    }
    const validCodes = ['virtues', 'gratitude', 'dpss'];
    
    if (validCodes.includes(code)) {
      try {
        const email = `${name.toLowerCase().replace(/\s+/g, '_')}@local.dpss`;
        const docRef = doc(db, 'allowed_users', email);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            email: email,
            name: name,
            registeredAt: Date.now(),
            lastLogin: Date.now(),
            status: 'active',
            accessCodeUsed: code
          });
        } else {
          await updateDoc(docRef, { 
            lastLogin: Date.now() 
          });
        }

        const newSession: UserSession = { 
          name: name, 
          code: code, 
          loginTime: Date.now(),
          email: email
        };
        setSession(newSession);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
      } catch (err: any) {
        setLoginError("Neural synchronization failed.");
      }
    } else { 
      setLoginError('Invalid Access Code.'); 
    }
  };

  const handleLogout = async () => { 
    setSession(null); 
    localStorage.removeItem(USER_SESSION_KEY); 
  };
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'completed');
  };

  const toggleInstruction = (id: string) => {
    setSelectedInstructionIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const setItemCount = (id: string, count: number) => {
    setItemCountOverrides(prev => ({ ...prev, [id]: count }));
  };

  const adjustColumns = (id: string, delta: number) => {
    setColumnOverrides(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(6, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setSourceMaterial({ 
          data: base64, 
          mimeType: file.type, 
          name: file.name 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image too large.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 600; 
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_DIM) { 
              height *= MAX_DIM / width; 
              width = MAX_DIM; 
            }
          } else {
            if (height > MAX_DIM) { 
              width *= MAX_DIM / height; 
              height = MAX_DIM; 
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
             setBrandSettings(prev => {
               const newLogos = [...prev.logos];
               const firstEmpty = newLogos.findIndex(l => !l);
               if (firstEmpty !== -1) {
                 newLogos[firstEmpty] = dataUrl;
               } else {
                 newLogos.push(dataUrl);
               }
               return { ...prev, logos: newLogos, logoData: dataUrl };
             });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (index: number) => {
    setBrandSettings(prev => {
      const newLogos = [...prev.logos];
      newLogos[index] = '';
      return { ...prev, logos: newLogos };
    });
  };

  const generateNeuralBlueprint = (count: number) => {
    const keys = ['A', 'B', 'C', 'D'];
    const blueprint: string[] = [];
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    const maxPerLetter = Math.max(1, Math.floor(count * 0.35));
    const minPerLetter = count >= 8 ? 2 : 1;
    for (const key of keys) {
      for (let i = 0; i < minPerLetter; i++) {
        if (blueprint.length < count) { 
          blueprint.push(key); 
          counts[key]++; 
        }
      }
    }
    while (blueprint.length < count) {
      const availableKeys = keys.filter(k => counts[k] < maxPerLetter);
      const randomKey = availableKeys.length === 0 ? keys[0] : availableKeys[Math.floor(Math.random() * availableKeys.length)];
      blueprint.push(randomKey);
      counts[randomKey]++;
    }
    for (let i = blueprint.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blueprint[i], blueprint[j]] = [blueprint[j], blueprint[i]];
    }
    return blueprint;
  };

  const handleGenerate = async () => {
    if (selectedInstructionIds.length === 0) { 
      alert("Please select a component."); 
      return; 
    }
    setIsGenerating(true);
    const selectedTemps = instructionTemplates.filter(t => selectedInstructionIds.includes(t.id));
    const filterByCategory = (rules: StrictRule[]) => rules.filter(r => r.active && (r.category === 'General' || r.category.toLowerCase() === activeModule.toLowerCase()));
    const filteredProtocols = filterByCategory(masterProtocols);
    const filteredRules = filterByCategory(strictRules);
    const selectedBlankStyle = '____________________';
    const protocolsPrompt = filteredProtocols.map(p => `[PROTOCOL - ${p.priority}]: ${p.promptInjection.replace(/{{BLANK}}/g, selectedBlankStyle)}`).join('\n');
    const rulesPrompt = filteredRules.map(r => `[STRICT RULE - ${r.priority}]: ${r.promptInjection.replace(/{{BLANK}}/g, selectedBlankStyle)}`).join('\n');
    const strategyInstruction = answerStrategy === 'GENERAL_MIXED' 
      ? `[STRATEGY]: GENERAL-MIXED. Context: {{TOPIC}}.` : `[STRATEGY]: TOPIC-FOCUSED. Context: {{TOPIC}}.`;

    const componentLogic = selectedTemps.map((t, idx) => {
      const overrideCol = columnOverrides[t.id] || 0;
      const overrideItems = itemCountOverrides[t.id] || 10;
      const blueprint = generateNeuralBlueprint(overrideItems);
      const blueprintStr = blueprint.map((key, i) => `${i + 1}:${key}`).join(', ');
      const formatInstruction = overrideCol > 0 ? `(FORMAT: HTML <table> with ${overrideCol} columns.)` : '';
      return `PART ${String.fromCharCode(65 + idx)} [MANDATORY INSTRUCTION HEADER: ${t.label}]: ${t.prompt.replace(/{{BLANK}}/g, selectedBlankStyle)} (GENERATE EXACTLY ${overrideItems} ITEMS) (USE THIS ANSWER KEY: ${blueprintStr}) ${formatInstruction}`;
    }).join('\n\n');

    const moduleSafetyGuard = activeModule === 'Grammar' ? `[MODULE SAFETY GUARD]: GRAMMAR assessment focus.` : '';
    const mandatorySequence = `1. PRE-ASSIGN balanced answer keys.\n2. GENERATE PARTS for "${topic}".`;

    const finalLogic = `${moduleSafetyGuard}\n${GLOBAL_STRICT_COMMAND.replace(/{{TOPIC}}/g, topic || "General English")}\n${protocolsPrompt}\n${strategyInstruction.replace(/{{TOPIC}}/g, topic || "General English")}\n${rulesPrompt}\n[SYSTEM OBJECTIVE]: COMPLETE assessment.\n[TARGET]: "${topic}"\n[LEVEL]: ${activeLevel}\n### SEQUENCE ###\n${mandatorySequence}\n${componentLogic}`;

    try {
      const availableLogos = brandSettings.logos.filter(l => !!l);
      if (availableLogos.length > 0) {
        const randomLogo = availableLogos[Math.floor(Math.random() * availableLogos.length)];
        setBrandSettings(prev => ({ ...prev, logoData: randomLogo }));
      }
      const result = await callNeuralEngine(activeEngine, finalLogic, protocolsPrompt, sourceMaterial, externalKeys);
      setWorksheetContent(result.text);
      setIsGenerating(false);
      setViewMode('preview');
      const newTestItem = {
        id: `hist-${Date.now()}`,
        title: `${activeLanguage} ${activeModule}: ${activeLevel} - ${topic || "Synthesis"}`,
        content: result.text,
        timestamp: Date.now(),
        module: activeModule,
        level: activeLevel,
        topic: topic,
        authorName: session?.name || 'Anonymous',
        authorEmail: session?.email || 'N/A'
      };
      setHistory(prev => [newTestItem, ...prev].slice(0, 30));
      await addDoc(collection(db, 'generatedTests'), newTestItem);
    } catch (error: any) {
      alert("Neural synthesis failed.");
      setIsGenerating(false);
    }
  };

  const handleAssistantMessage = async (msg: string, file?: QuickSource) => {
    const userMsg: ChatMessage = { 
      id: `msg-${Date.now()}`, 
      role: 'user', 
      text: msg, 
      timestamp: Date.now() 
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    const result = await callNeuralEngine(activeEngine, msg, worksheetContent, file || sourceMaterial, externalKeys);
    setChatMessages(prev => [...prev, { 
      id: `msg-bot-${Date.now()}`, 
      role: 'architect', 
      text: "Synthesis updated.", 
      timestamp: Date.now() 
    }]);
    setWorksheetContent(result.text);
    setIsGenerating(false);
  };

  const handleExportWord = () => {
    if (!worksheetContent) return;
    const logoHtml = brandSettings.logoData ? `<table style="width: 100%; border: none; margin-bottom: 8pt;"><tr><td style="border: none; text-align: center;"><img src="${brandSettings.logoData}" width="621" style="width: 16.43cm;" /></td></tr></table>` : '';
    const header = `${logoHtml}<table style="width: 100%; border-bottom: 2pt solid black; margin-bottom: 15pt;"><tr><td style="border: none; width: 50%;"><b>Teacher:</b> ${session?.name}</td><td style="border: none; width: 50%; text-align: right;"><b>${activeModule}: ${topic}</b><br/>${activeLevel}</td></tr></table>`;
    exportToWord(worksheetContent, `DPSS_Test`, header, '0.6cm');
  };

  const updateRule = (id: string, updates: Partial<StrictRule>) => {
    setStrictRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };
  
  const updateProtocol = (id: string, updates: Partial<StrictRule>) => {
    setMasterProtocols(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  
  const updateTemplate = (id: string, updates: Partial<InstructionTemplate>) => {
    setInstructionTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTemplate = (id: string) => {
    setInstructionTemplates(prev => prev.filter(t => t.id !== id));
  };
  
  const deleteRule = (id: string) => {
    setStrictRules(prev => prev.filter(r => r.id !== id));
  };
  
  const deleteProtocol = (id: string) => {
    setMasterProtocols(prev => prev.filter(p => p.id !== id));
  };
  
  const syncWithDefaults = () => {
    setMasterProtocols(prev => [...prev, ...DEFAULT_MASTER_PROTOCOLS.filter(p => !prev.some(x => x.id === p.id))]);
    setStrictRules(prev => [...prev, ...DEFAULT_STRICT_RULES.filter(r => !prev.some(x => x.id === r.id))]);
    setInstructionTemplates(prev => [...prev, ...INITIAL_TEMPLATES.filter(t => !prev.some(x => x.id === t.id))]);
    alert("Synchronized.");
  };

  const hardReset = () => {
    if (confirm("Delete all? This action cannot be undone.")) {
      localStorage.removeItem(MASTER_PROTOCOLS_KEY);
      localStorage.removeItem(STRICT_RULES_KEY);
      localStorage.removeItem(TEMPLATES_KEY);
      window.location.reload();
    }
  };

  const addRule = () => {
    const newRule: StrictRule = { 
      id: `rule-${Date.now()}`, 
      label: 'NEW LOGIC NODE', 
      description: '', 
      promptInjection: '', 
      active: true, 
      priority: 'Medium', 
      category: activeLogicCategory 
    };
    setStrictRules([...strictRules, newRule]); 
    setExpandedRuleId(newRule.id);
  };

  const addProtocol = () => {
    const newProtocol: StrictRule = { 
      id: `mp-${Date.now()}`, 
      label: 'NEW PROTOCOL', 
      description: '', 
      promptInjection: '', 
      active: true, 
      priority: 'Medium', 
      category: activeProtocolCategory 
    };
    setMasterProtocols([...masterProtocols, newProtocol]); 
    setExpandedProtocolId(newProtocol.id);
  };

  const addTemplate = () => {
    const newId = `temp-${Date.now()}`;
    setInstructionTemplates(prev => [
      ...prev, 
      { 
        id: newId, 
        label: `NEW PART`, 
        prompt: `Detail logic...`, 
        category: activeTemplateCategory as any, 
        columnCount: 0 
      }
    ]);
    setExpandedTemplateId(newId);
  };

  if (!session) {
    return (
      <div className="h-screen w-screen bg-[#0b1221] flex items-center justify-center p-6 text-white overflow-hidden">
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[64px] p-12 text-center shadow-2xl">
           <div className="h-20 w-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-12"><i className="fa-solid fa-bolt text-white text-3xl"></i></div>
           <h1 className="text-2xl font-[900] uppercase tracking-wider mb-8">DPSS Ultimate Test Builder Backend</h1>
           <form onSubmit={handleLogin} className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-6 duration-500">
              <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-orange-500 font-bold" />
              <input type="password" value={loginCode} onChange={(e) => setLoginCode(e.target.value)} placeholder="Access Code" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-orange-500 font-bold" />
              {loginError && <p className="text-rose-500 text-xs font-black uppercase text-center">{loginError}</p>}
              <button type="submit" className="w-full bg-orange-600 text-white py-6 rounded-3xl text-sm font-black uppercase tracking-widest hover:brightness-110 shadow-xl transition-all">Synchronize</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden text-slate-300 relative transition-all duration-500">
      {showOnboarding && <OnboardingTutorial onComplete={handleOnboardingComplete} />}
      {viewMode === 'generator' && (
        <>
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[#1f2937] flex flex-col shrink-0 lg:relative lg:translate-x-0 lg:w-80 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-500`}>
            <div className="p-6 border-b border-[#1f2937] flex justify-between items-center"><h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">History Log</h2><button onClick={() => setIsSidebarOpen(false)} className="lg:hidden h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><i className="fa-solid fa-xmark"></i></button></div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
               {history.map(item => (
                 <button key={item.id} onClick={() => { setWorksheetContent(item.content); setViewMode('preview'); }} className="w-full text-left p-4 rounded-2xl bg-[#111827] border border-[#1f2937] hover:border-orange-500/30 transition-all">
                   <div className="text-[11px] font-bold text-slate-400 line-clamp-1">{item.title}</div>
                 </button>
               ))}
            </div>
              <div className="p-6 border-t border-[#1f2937] space-y-2">
              <button onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-accent-orange-dark to-accent-orange-light text-white shadow-lg uppercase text-[11px] font-black hover:brightness-110 transition-all"><span>Architect Settings</span><i className="fa-solid fa-gear"></i></button>
              <button onClick={handleLogout} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-[9px] font-black uppercase hover:bg-white/10 transition-all">Logout</button>
            </div>
          </aside>
          <main className="flex-1 border-r border-[#1f2937] flex flex-col overflow-y-auto no-scrollbar transition-all duration-500">
            <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8 lg:space-y-12">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white lg:hidden"><i className={`fa-solid ${isSidebarOpen ? 'fa-angles-left' : 'fa-bars'}`}></i></button>
                  <div><h1 className="text-xl lg:text-3xl font-[900] uppercase tracking-wider text-white">DPSS Ultimate Test Builder</h1><span className="text-orange-500 text-[9px] font-black uppercase tracking-widest mt-1 block">Architect: {session.name}</span></div>
                </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Assessment Matrix</h3>
                  <div className="flex bg-[#111827] p-1.5 rounded-2xl border border-[#1f2937] gap-1 overflow-x-auto no-scrollbar">
                    {INITIAL_MODULES.map(mod => (
                      <button key={mod} onClick={() => { setActiveModule(mod); setSelectedInstructionIds([]); mod === 'Grammar' ? setViewMode('grammar_iframe') : setViewMode('generator'); }} 
                        className={`flex-1 min-w-[100px] py-4 px-6 rounded-xl transition-all ${(activeModule === mod && (viewMode === 'generator' || viewMode === 'grammar_iframe')) ? 'bg-accent-blue text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>
                        <div className="text-[11px] font-black tracking-widest">{mod}</div>
                      </button>
                    ))}
                    <button onClick={() => setViewMode('book_creation')} className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl transition-all ${viewMode === 'book_creation' ? 'bg-accent-blue text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}><div className="text-[11px] font-black tracking-widest">Book Creation</div></button>
                  </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Topic Anchor</h3>
                 <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Target Topic..." className="w-full h-40 bg-[#111827] border border-[#1f2937] rounded-[40px] p-6 text-white outline-none focus:border-orange-500/50 resize-none font-medium" />
              </div>
              <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-accent-orange-dark to-accent-orange-light text-white py-6 lg:py-8 rounded-[40px] text-lg lg:text-xl font-black uppercase tracking-[0.25em] shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-6">{isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}Synthesize Full Test</button>
            </div>
          </main>
        </>
      )}
      {viewMode === 'preview' && (
        <section className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1f2937] flex justify-between items-center backdrop-blur-xl z-10 no-print shadow-2xl">
            <button onClick={() => setViewMode('generator')} className="border border-[#1f2937] text-white px-8 py-3 rounded-full text-[11px] font-black uppercase hover:bg-slate-900/50 shadow-xl">ARCHITECT</button>
            <button onClick={handleExportWord} className="px-10 py-3 bg-[#ea580c] text-white rounded-full text-[11px] font-black uppercase shadow-2xl">EXPORT DOC</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar"><Worksheet content={worksheetContent} onContentChange={setWorksheetContent} isGenerating={isGenerating} theme={THEMES.find(t => t.id === activeThemeId) || THEMES[0]} paperType="Plain" brandSettings={brandSettings} level={activeLevel} module={activeModule} topic={topic} /></div>
        </section>
      )}
      {viewMode === 'grammar_iframe' && (
        <section className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
          <div className="p-4 lg:p-6 border-b border-[#1f2937] flex flex-wrap gap-4 justify-between items-center backdrop-blur-xl z-10 no-print shadow-2xl">
            <button onClick={() => setViewMode('generator')} className="border border-[#1f2937] text-white px-6 lg:px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-900/50 flex items-center gap-4 group shadow-xl">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> ARCHITECT
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-white font-black uppercase tracking-widest text-[12px]">Neural Grammar Architect</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87?showPreview=true&showAssistant=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 shadow-xl flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <iframe 
              src="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87?showPreview=true&showAssistant=true"
              className="w-full h-full min-h-[800px] border-none relative z-10"
              title="Grammar Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </section>
      )}
      {viewMode === 'book_creation' && (
        <section className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
          <div className="p-4 lg:p-6 border-b border-[#1f2937] flex flex-wrap gap-4 justify-between items-center backdrop-blur-xl z-10 no-print shadow-2xl">
            <button onClick={() => setViewMode('generator')} className="border border-[#1f2937] text-white px-6 lg:px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-900/50 flex items-center gap-4 group shadow-xl">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> ARCHITECT
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-white font-black uppercase tracking-widest text-[12px]">Neural Book Architect</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://remix-book-creation-4-deploy-370806846570.us-west1.run.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 shadow-xl flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <iframe 
              src="https://remix-book-creation-4-deploy-370806846570.us-west1.run.app/"
              className="w-full h-full min-h-[800px] border-none relative z-10"
              title="Book Creation Tool"
            />
          </div>
        </section>
      )}
      {!showSettings && (
        <button onClick={() => setIsAssistantVisible(!isAssistantVisible)} className={`fixed bottom-6 right-6 h-16 w-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${isAssistantVisible ? 'bg-orange-600 rotate-90' : 'bg-slate-800'}`}>
          <i className={`fa-solid ${isAssistantVisible ? 'fa-xmark' : 'fa-wand-magic-sparkles text-xl'}`}></i>
        </button>
      )}
      {showSettings && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] rounded-[48px] w-full max-w-7xl h-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col border border-white/50">
             <div className="p-8 pb-4 flex justify-between items-center">
               <h2 className="text-[12px] font-black uppercase text-slate-900 tracking-widest">Workspace Control</h2>
               <button onClick={() => setShowSettings(false)} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900">
                 <i className="fa-solid fa-xmark text-xl"></i>
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-12">
                <div className="p-8 bg-slate-100 rounded-3xl border border-slate-200">
                   <h3 className="font-black uppercase text-slate-400 text-[10px] mb-4">Active Logic Tab</h3>
                   <p className="text-slate-900 font-bold uppercase">{settingsTab}</p>
                </div>
             </div>

             <div className="p-12 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={hardReset} className="px-16 py-6 bg-rose-600 text-white rounded-full text-[12px] font-black uppercase shadow-xl hover:bg-rose-700 transition-all">Hard Reset</button>
                <button onClick={() => setShowSettings(false)} className="px-16 py-6 bg-gradient-to-r from-accent-orange-dark to-accent-orange-light text-white rounded-full text-[12px] font-black uppercase shadow-xl hover:brightness-110 transition-all">Close Panel</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
