import './index.css';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, Keyboard, RefreshCcw, Info, BarChart3, Volume2, VolumeX, Sun, Type, Sliders, Maximize, GraduationCap, Headphones, Gamepad2, PlayCircle, LockKeyhole, ArrowLeft, Play, Rewind } from 'lucide-react';

// ==========================================
// 1. CONSTANTS, DICTIONARIES & CONFIGURATION
// ==========================================

const THEMES = {
  indian: { id: 'indian', name: 'Indian (Default)', bg: '#fdfdfd', main: '#138808', sub: '#cbd5e1', text: '#FF9933', error: '#ef4444' },
  dark: { id: 'dark', name: 'Dark Void', bg: '#0f172a', main: '#38bdf8', sub: '#475569', text: '#f8fafc', error: '#f43f5e' },
  light: { id: 'light', name: 'Clean Light', bg: '#ffffff', main: '#0ea5e9', sub: '#94a3b8', text: '#0f172a', error: '#ef4444' },
  saffron: { id: 'saffron', name: 'Deep Saffron', bg: '#1a1005', main: '#FF9933', sub: '#7a5a3a', text: '#fff3e0', error: '#e11d48' },
  terminal: { id: 'terminal', name: 'Hacker Terminal', bg: '#000000', main: '#22c55e', sub: '#166534', text: '#4ade80', error: '#dc2626' },
  monokai: { id: 'monokai', name: 'Monokai', bg: '#272822', main: '#a6e22e', sub: '#75715e', text: '#f8f8f2', error: '#f92672' },
  cyberpunk: { id: 'cyberpunk', name: 'Cyberpunk', bg: '#fef08a', main: '#06b6d4', sub: '#f59e0b', text: '#1e3a8a', error: '#e11d48' },
};

const FONTS = [
  { id: 'inter', name: 'Inter (Default)', family: "'Inter', sans-serif" },
  { id: 'roboto_mono', name: 'Roboto Mono', family: "'Roboto Mono', monospace" },
  { id: 'fira_code', name: 'Fira Code', family: "'Fira Code', monospace" },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'lora', name: 'Lora', family: "'Lora', serif" },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif" },
  { id: 'ubuntu', name: 'Ubuntu', family: "'Ubuntu', sans-serif" },
  { id: 'inconsolata', name: 'Inconsolata', family: "'Inconsolata', monospace" },
  { id: 'source_code_pro', name: 'Source Code Pro', family: "'Source Code Pro', monospace" },
  { id: 'opendyslexic', name: 'Open Dyslexic', family: "'OpenDyslexic', sans-serif" },
  { id: 'comic_neue', name: 'Comic Neue', family: "'Comic Neue', cursive" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif" },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive" },
  { id: 'mangal', name: 'Mangal (Hindi System)', family: "'Mangal', 'Arial Unicode MS', sans-serif" },
  { id: 'krutidev', name: 'Kruti Dev 010 (Legacy)', family: "'Kruti Dev 010', 'Krutidev', sans-serif" },
  { id: 'noto_sans_dev', name: 'Noto Sans Devanagari', family: "'Noto Sans Devanagari', sans-serif" },
  { id: 'yatra_one', name: 'Yatra One', family: "'Yatra One', display" },
];

const SOUND_THEMES = ['typewriter', 'mechanical', 'bubble', 'arcade', 'laser', 'woodblock', 'soft_click', 'blue_switch', 'chime', 'thump'];

const DICTIONARY_API_MOCK = {
  english_normal: "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us algorithm development infrastructure communication configuration application management organization professional responsibility technology architecture implementation understanding performance environment experience international significant particular individual philosophy psychological extraordinary unpredictable uncharacteristically comprehensive systematically".split(" "),
  hindi_mangal_inscript: "यह है और की में के लिए एक पर नहीं से को इस कि जो कर तो ही या रहा था वाले बाद जब तक अपने कुछ भी क्या गया हो सकता बहुत हुए ऐसा वह रहे बारे कैसे होने करने सरकार भारत विकास उपयोग समाज विज्ञान परिवार अधिकार महिला निर्माण समस्या व्यवस्था कार्यक्रम जानकारी माध्यम इसलिए प्रतिशत अंतर्राष्ट्रीय विश्वविद्यालय प्रासंगिकता औद्योगिकीकरण प्रतिस्पर्धात्मकता निम्नलिखित आवश्यकताएं पारिस्थितिकी महत्वाकांक्षी प्रकटीकरण अर्थव्यवस्थाओं प्रौद्योगिकी विशेषताओं संवेदनशीलता आत्मनिर्भरता विश्व वर्तमान पारिस्थितिकीय अवस्था अत्यंत चिंताजनक मानवीय हस्तक्षेप प्रकृति सूक्ष्म संतुलन झकझोर ग्लोबल-वार्मिंग हिमनदों पिघलना अनियंत्रित ऋतु-परिवर्तन संयोग दुष्कर्मों प्रतिफल वैज्ञानिकों कार्बन-उत्सर्जन नियंत्रित आगामी शताब्दियों पृथ्वी मरुस्थल आध्यात्मिक दृष्टिकोण रक्षिता वृक्षारोपण सतत-विकास पर्यावरण-हितैषी तकनीकों प्राथमिकता प्रतिबद्ध सजगता खुशहाली".split(" "),
  hindi_mangal_remington: "यह है और की में के लिए एक पर नहीं से को इस कि जो कर तो ही या रहा था वाले बाद जब तक अपने कुछ भी क्या गया हो सकता बहुत हुए ऐसा वह रहे बारे कैसे होने करने सरकार भारत विकास उपयोग समाज विज्ञान परिवार अधिकार महिला निर्माण समस्या व्यवस्था कार्यक्रम जानकारी माध्यम इसलिए प्रतिशत अंतर्राष्ट्रीय".split(" "),
  hindi_krutidev: "gS vkSj dh esa ds fy, ,d ij ugha ls dks bl fd tks dj rks gh ;k jgk Fkk okys ckn tc rd vius dqN Hkh D;k x;k gks ldrk cgqr gq, ,slk og jgs ckjs dSls gksus djus ljdkj Hkkjr fodkl mi;ksx lekt foKku ifjokj vf/kdkj efgyk fuekZ.k leL;k O;oLFkk dk;ZØe tkudkjh ek/;e blfy, izfr'kr vUrjkZ\"Vªh; fo'ofo|ky;".split(" "),
  hinglish: "kya haal hai bhai kaise ho sab theek chal raha thik yaar kal milte hain khana kha liya chalo baad mein baat karte kaam kaisa accha mujhe nahi pata kab aayega dekh lenge so jao samajh nahi aara jaldi aao ghoomne chalenge mast zabardast behtareen pareshani".split(" "),
};

const KEYBOARD_LAYOUT = [
  [
    { code: 'Backquote', en: '`', enShift: '~', hi: 'ृ', hiShift: 'ऋ' }, { code: 'Digit1', en: '1', enShift: '!', hi: '१', hiShift: 'ऍ' }, { code: 'Digit2', en: '2', enShift: '@', hi: '२', hiShift: 'ॅ' }, { code: 'Digit3', en: '3', enShift: '#', hi: '३', hiShift: 'र्' }, { code: 'Digit4', en: '4', enShift: '$', hi: '४', hiShift: 'र्' }, { code: 'Digit5', en: '5', enShift: '%', hi: '५', hiShift: 'ज्ञ' }, { code: 'Digit6', en: '6', enShift: '^', hi: '६', hiShift: 'त्र' }, { code: 'Digit7', en: '7', enShift: '&', hi: '७', hiShift: 'क्ष' }, { code: 'Digit8', en: '8', enShift: '*', hi: '८', hiShift: 'श्र' }, { code: 'Digit9', en: '9', enShift: '(', hi: '९', hiShift: '(' }, { code: 'Digit0', en: '0', enShift: ')', hi: '०', hiShift: ')' }, { code: 'Minus', en: '-', enShift: '_', hi: '-', hiShift: 'ः' }, { code: 'Equal', en: '=', enShift: '+', hi: 'ृ', hiShift: 'ऋ' }, { code: 'Backspace', display: 'Backspace', isSpecial: true, width: 'w-16 sm:w-24 text-[10px] sm:text-sm' }
  ],
  [
    { code: 'Tab', display: 'Tab', isSpecial: true, width: 'w-12 sm:w-16 text-xs' }, { code: 'KeyQ', en: 'q', enShift: 'Q', hi: 'ौ', hiShift: 'औ' }, { code: 'KeyW', en: 'w', enShift: 'W', hi: 'ै', hiShift: 'ऐ' }, { code: 'KeyE', en: 'e', enShift: 'E', hi: 'ा', hiShift: 'आ' }, { code: 'KeyR', en: 'r', enShift: 'R', hi: 'ी', hiShift: 'ई' }, { code: 'KeyT', en: 't', enShift: 'T', hi: 'ू', hiShift: 'ऊ' }, { code: 'KeyY', en: 'y', enShift: 'Y', hi: 'ब', hiShift: 'भ' }, { code: 'KeyU', en: 'u', enShift: 'U', hi: 'ह', hiShift: 'ङ' }, { code: 'KeyI', en: 'i', enShift: 'I', hi: 'ग', hiShift: 'घ' }, { code: 'KeyO', en: 'o', enShift: 'O', hi: 'द', hiShift: 'ध' }, { code: 'KeyP', en: 'p', enShift: 'P', hi: 'ज', hiShift: 'झ' }, { code: 'BracketLeft', en: '[', enShift: '{', hi: 'ड', hiShift: 'ढ' }, { code: 'BracketRight', en: ']', enShift: '}', hi: '़', hiShift: 'ञ' }, { code: 'Backslash', en: '\\', enShift: '|', hi: 'ॉ', hiShift: 'ऑ' }
  ],
  [
    { code: 'CapsLock', display: 'Caps', isSpecial: true, width: 'w-16 sm:w-20 text-xs' }, { code: 'KeyA', en: 'a', enShift: 'A', hi: 'ो', hiShift: 'ओ' }, { code: 'KeyS', en: 's', enShift: 'S', hi: 'े', hiShift: 'ए' }, { code: 'KeyD', en: 'd', enShift: 'D', hi: '्', hiShift: 'अ' }, { code: 'KeyF', en: 'f', enShift: 'F', hi: 'ि', hiShift: 'इ' }, { code: 'KeyG', en: 'g', enShift: 'G', hi: 'ु', hiShift: 'उ' }, { code: 'KeyH', en: 'h', enShift: 'H', hi: 'प', hiShift: 'फ' }, { code: 'KeyJ', en: 'j', enShift: 'J', hi: 'र', hiShift: 'ऱ' }, { code: 'KeyK', en: 'k', enShift: 'K', hi: 'क', hiShift: 'ख' }, { code: 'KeyL', en: 'l', enShift: 'L', hi: 'त', hiShift: 'थ' }, { code: 'Semicolon', en: ';', enShift: ':', hi: 'च', hiShift: 'छ' }, { code: 'Quote', en: "'", enShift: '"', hi: 'ट', hiShift: 'ठ' }, { code: 'Enter', display: 'Enter', isSpecial: true, width: 'w-16 sm:w-24 text-xs' }
  ],
  [
    { code: 'ShiftLeft', display: 'Shift', isSpecial: true, width: 'w-20 sm:w-28 text-xs' }, { code: 'KeyZ', en: 'z', enShift: 'Z', hi: 'े', hiShift: 'ऑ' }, { code: 'KeyX', en: 'x', enShift: 'X', hi: 'ं', hiShift: 'ँ' }, { code: 'KeyC', en: 'c', enShift: 'C', hi: 'म', hiShift: 'ण' }, { code: 'KeyV', en: 'v', enShift: 'V', hi: 'न', hiShift: 'ऩ' }, { code: 'KeyB', en: 'b', enShift: 'B', hi: 'व', hiShift: 'व' }, { code: 'KeyN', en: 'n', enShift: 'N', hi: 'ल', hiShift: 'ळ' }, { code: 'KeyM', en: 'm', enShift: 'M', hi: 'स', hiShift: 'श' }, { code: 'Comma', en: ',', enShift: '<', hi: ',', hiShift: 'ष' }, { code: 'Period', en: '.', enShift: '>', hi: '.', hiShift: '।' }, { code: 'Slash', en: '/', enShift: '?', hi: 'य', hiShift: 'य' }, { code: 'ShiftRight', display: 'Shift', isSpecial: true, width: 'w-20 sm:w-28 text-xs' }
  ]
];

// ==========================================
// 2. CURRICULUM & ENGINE LOGIC
// ==========================================

const LEARNING_PHASES = {
  english: [
    { name: "Basics & Home Row (F J)", chars: "fj" }, { name: "Home Row (D K)", chars: "fjdk" }, { name: "Home Row (S L)", chars: "fjdksl" }, { name: "Home Row (A ;)", chars: "fjdksla;" }, { name: "Full Home Row", chars: "asdfjkl;gh" },
    { name: "Top Row (R U)", chars: "ru" }, { name: "Top Row (E I)", chars: "reui" }, { name: "Top Row (W O)", chars: "rewuio" }, { name: "Top Row (Q P)", chars: "qweruiop" }, { name: "Full Top Row", chars: "qwertyuiop" },
    { name: "Bottom Row (V M)", chars: "vm" }, { name: "Bottom Row (C ,)", chars: "cvm," }, { name: "Bottom Row (X .)", chars: "xcvm,." }, { name: "Bottom Row (Z /)", chars: "zxcvbnm,./" }, { name: "Full Bottom Row", chars: "zxcvbnm,./" },
    { name: "Shift Keys (Right)", chars: "ASDFG" }, { name: "Shift Keys (Left)", chars: "HJKL:" }, { name: "Shift Keys (Top)", chars: "QWERTYUIOP" }, { name: "Shift Keys (Bottom)", chars: "ZXCVBNM" }, { name: "All Shift Keys", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { name: "Numbers (1 2 3)", chars: "123" }, { name: "Numbers (4 5 6)", chars: "123456" }, { name: "Numbers (7 8 9 0)", chars: "1234567890" }, { name: "Symbols (! @ #)", chars: "!@#" }, { name: "All Symbols", chars: "!@#$%^&*()" },
    { name: "Word Practice 1", dict: true }, { name: "Word Practice 2", dict: true }, { name: "Word Practice 3", dict: true }, { name: "Sentence Practice 1", dict: true }, { name: "Mastery Test", dict: true }
  ],
  hindi: [
    { name: "Home Row (Left Matras)", chars: "ोे्िु" }, { name: "Home Row (Right Consonants)", chars: "परकतचट" }, { name: "Home Row (Full)", chars: "ोे्िुपरकचट" },
    { name: "Top Row (Left Matras)", chars: "ौैाीू" }, { name: "Top Row (Right Consonants)", chars: "बहगदजड" }, { name: "Top Row (Full)", chars: "ौैाीूबहगदजड" },
    { name: "Home & Top Row Mix", chars: "ोे्िुपरकचटौैाीूबहगदजड" },
    { name: "Bottom Row (Left)", chars: "ऑंमन" }, { name: "Bottom Row (Right)", chars: "वलसय" }, { name: "Bottom Row (Full)", chars: "ऑंमनवलसय,." },
    { name: "Shift Home Row", chars: "ओएअइउफऱखथछठ" }, { name: "Shift Top Row", chars: "औऐआईऊभङघधझढ" }, { name: "Shift Bottom Row", chars: "ऑँणऩवळशष।" },
    { name: "Numbers Row", chars: "१२३४५६७८९०" }, { name: "Symbols & Complex", chars: "ऍॅर्ज्ञत्रक्षश्र()ःऋृ" },
    { name: "Word Practice 1", dict: true }, { name: "Word Practice 2", dict: true }, { name: "Word Practice 3", dict: true }, { name: "Sentence Practice 1", dict: true }, { name: "Mastery Test", dict: true }
  ],
  krutidev: [
    { name: "Home Row (Left)", chars: "asdfg" }, { name: "Home Row (Right)", chars: "hjkl;'" }, { name: "Home Row (Full)", chars: "asdfghjkl;'" },
    { name: "Top Row (Left)", chars: "qwert" }, { name: "Top Row (Right)", chars: "yuiop[]" }, { name: "Top Row (Full)", chars: "qwertyuiop[]" },
    { name: "Home & Top Row Mix", chars: "asdfghjkl;'qwertyuiop[]" },
    { name: "Bottom Row (Left)", chars: "zxcv" }, { name: "Bottom Row (Right)", chars: "bnm,./" }, { name: "Bottom Row (Full)", chars: "zxcvbnm,./" },
    { name: "Shift Home Row", chars: "ASDFGHJKL:\"" }, { name: "Shift Top Row", chars: "QWERTYUIOP{}" }, { name: "Shift Bottom Row", chars: "ZXCVBNM<>?" },
    { name: "Numbers Row", chars: "1234567890" }, { name: "Symbols & Complex", chars: "!@#$%^&*()_+-=" },
    { name: "Word Practice 1", dict: true }, { name: "Word Practice 2", dict: true }, { name: "Word Practice 3", dict: true }, { name: "Sentence Practice 1", dict: true }, { name: "Mastery Test", dict: true }
  ]
};

const applyProMutations = (words, lang) => {
  return words.map(w => {
    let newWord = w; const rand = Math.random();
    if (lang.includes('english')) {
      if (rand < 0.2) newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1);
      if (rand < 0.1) newWord += ','; else if (rand < 0.15) newWord += '.'; else if (rand < 0.18) newWord += '?';
    } else if (lang.includes('mangal') || lang.includes('krutidev')) {
      const hardPrefixes = ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'छ', 'ठ', 'ढ', 'ध', 'भ'];
      if (rand < 0.10) newWord = hardPrefixes[Math.floor(Math.random() * hardPrefixes.length)] + newWord.slice(1);
      const randPunc = Math.random();
      if (randPunc < 0.10) newWord += '।'; else if (randPunc < 0.15) newWord += ','; else if (randPunc < 0.20) newWord += '?'; 
    }
    return newWord;
  });
};

const useLocalStorage = (key, initialValue) => {
  const [val, setVal] = useState(() => {
    try { const saved = window.localStorage.getItem(key); return saved ? JSON.parse(saved) : initialValue; } 
    catch (error) { return initialValue; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
};

const useTextEngine = (language, difficulty, mode, appMode, lessonId) => {
  const [words, setWords] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const fetchDictionary = async (lang) => {
    return new Promise(resolve => setTimeout(() => resolve(DICTIONARY_API_MOCK[lang] || DICTIONARY_API_MOCK.english_normal), 50));
  };

  const generateWordsBatch = useCallback((dict, count) => {
    if (appMode === 'learning' && lessonId !== null) {
      let langKey = 'english';
      if (language.includes('krutidev')) langKey = 'krutidev';
      else if (language.includes('mangal')) langKey = 'hindi';

      const phase = LEARNING_PHASES[langKey][lessonId];
      if (phase && !phase.dict) {
         let generated = [];
         const charSet = phase.chars;
         for (let i = 0; i < count; i++) {
           let word = '';
           const len = Math.floor(Math.random() * 3) + 2; 
           for(let j=0; j<len; j++) word += charSet.charAt(Math.floor(Math.random() * charSet.length));
           generated.push(word);
         }
         return generated;
      }
    }

    let filteredList = dict;
    if (difficulty === 'easy') filteredList = dict.filter(w => w.length <= 4);
    else if (difficulty === 'medium') filteredList = dict.filter(w => w.length >= 4 && w.length <= 7);
    else if (difficulty === 'hard' || difficulty === 'pro') filteredList = dict.filter(w => w.length >= 7);
    if (filteredList.length < 15) filteredList = dict;

    let generated = [];
    let lastWord = '';
    for (let i = 0; i < count; i++) {
      let nextWord;
      do { nextWord = filteredList[Math.floor(Math.random() * filteredList.length)]; } while (nextWord === lastWord && filteredList.length > 1);
      generated.push(nextWord); lastWord = nextWord;
    }
    if (difficulty === 'pro') generated = applyProMutations(generated, language);
    return generated;
  }, [difficulty, language, appMode, lessonId]);

  const resetEngine = useCallback(async (count = 40) => {
    setIsReady(false);
    const dict = await fetchDictionary(language);
    const initialWords = generateWordsBatch(dict, count);
    setWords(initialWords);
    setIsReady(true);
  }, [language, generateWordsBatch]);

  const appendWords = useCallback(async (count = 20) => {
    if (appMode === 'learning') return; 
    const dict = await fetchDictionary(language);
    const newWords = generateWordsBatch(dict, count);
    setWords(prev => [...prev, ...newWords]);
  }, [language, generateWordsBatch, appMode]);

  return { words, isReady, resetEngine, appendWords };
};

// Web Audio API Synths
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;
const playSound = (theme = 'typewriter', isError = false) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode); gainNode.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (isError) {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
    gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(); osc.stop(now + 0.2); return;
  }

  switch(theme) {
    case 'mechanical': osc.type = 'triangle'; osc.frequency.setValueAtTime(120, now); osc.frequency.exponentialRampToValueAtTime(30, now + 0.1); gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    case 'bubble': osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.05); gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05); break;
    case 'arcade': osc.type = 'square'; osc.frequency.setValueAtTime(800, now); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05); break;
    case 'laser': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    case 'woodblock': osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.03); gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03); osc.start(); osc.stop(now + 0.03); break;
    case 'soft_click': osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(150, now + 0.04); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04); osc.start(); osc.stop(now + 0.04); break;
    case 'blue_switch': osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.08); gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08); osc.start(); osc.stop(now + 0.08); break;
    case 'chime': osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.15); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); osc.start(); osc.stop(now + 0.15); break;
    case 'thump': osc.type = 'triangle'; osc.frequency.setValueAtTime(80, now); osc.frequency.exponentialRampToValueAtTime(20, now + 0.1); gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    default: osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.05); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05);
  }
};

// ==========================================
// 3. ZERO-LATENCY GRAPHEME RENDERING
// ==========================================
const MemoizedWord = React.memo(({ word = '', typed = '', isActive }) => {
  const safeWord = String(word || '');
  const safeTyped = String(typed || '');
  const isErrorWord = !isActive && safeTyped !== safeWord && safeTyped !== '';
  
  const getStatus = (index) => {
    if (index < 0 || index >= safeWord.length) return 'none';
    if (index < safeTyped.length) return safeTyped[index] === safeWord[index] ? 'correct' : 'incorrect';
    return 'untyped';
  };

  return (
    <div className={`word relative inline-block mx-[0.4em] my-[0.2em] leading-relaxed transition-colors duration-100 ${isActive ? 'active' : ''} ${isErrorWord ? 'border-b-2 border-[var(--text-error)]' : ''}`}>
      {safeWord.split('').map((char, charIdx) => {
        const status = getStatus(charIdx);
        const prevStatus = getStatus(charIdx - 1);
        let charClass = 'text-[var(--text-sub)] opacity-30'; 
        let explicitStyleColor = 'var(--text-sub)';
        
        if (status === 'correct') { charClass = 'text-[var(--text-main)] correct opacity-100'; explicitStyleColor = 'var(--text-main)'; } 
        else if (status === 'incorrect') { charClass = 'text-[var(--text-error)] bg-[var(--text-error)]/20 incorrect opacity-100'; explicitStyleColor = 'var(--text-error)'; }

        const isExpected = isActive && charIdx === safeTyped.length;
        if (isExpected) { charClass = 'text-[var(--text-sub)] expected opacity-100 bg-[var(--text-sub)]/20 rounded-sm'; explicitStyleColor = 'var(--text-sub)'; }

        let displayChar = char;
        const isCombiningMark = /^\p{M}$/u.test(char);
        
        if (isCombiningMark && status === 'untyped' && (prevStatus === 'correct' || prevStatus === 'incorrect')) displayChar = '◌' + char;

        return ( <span key={charIdx} className={`letter inline transition-all duration-100 ${charClass}`} style={{ color: explicitStyleColor }}>{displayChar}</span> );
      })}
      {safeTyped.length > safeWord.length && safeTyped.slice(safeWord.length).split('').map((char, charIdx) => (
        <span key={`extra-${charIdx}`} className="letter extra inline text-[var(--text-error)] opacity-70 bg-[var(--text-error)]/20 rounded-sm" style={{ color: 'var(--text-error)' }}>{char}</span>
      ))}
    </div>
  );
});

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [appMode, setAppMode] = useState('home'); 
  const [theme, setTheme] = useState(THEMES.indian);
  const [font, setFont] = useState(FONTS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundTheme, setSoundTheme] = useState('typewriter');
  const [textSize, setTextSize] = useState(50); 
  const [containerWidth, setContainerWidth] = useState(80); 
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const [mode, setMode] = useState('time'); 
  const [timeConfig, setTimeConfig] = useState(30);
  const [wordConfig, setWordConfig] = useState(25);
  const [language, setLanguage] = useState('english_normal');
  const [difficulty, setDifficulty] = useState('medium');
  const [showSettings, setShowSettings] = useState(false);

  const [learningProgress, setLearningProgress] = useLocalStorage('tezzProgress', { english: 0, hindi: 0, krutidev: 0 });
  const [activeLesson, setActiveLesson] = useState(0);

  const { words, isReady, resetEngine, appendWords } = useTextEngine(language, difficulty, appMode === 'learning' ? 'words' : mode, appMode, activeLesson);
  const [typedHistory, setTypedHistory] = useState([]); 
  const [currentWordInput, setCurrentWordInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [keystrokes, setKeystrokes] = useState({ correct: 0, incorrect: 0 });
  const [errorMap, setErrorMap] = useState({});
  const [lastPressedKeyStr, setLastPressedKeyStr] = useState(null);

  const [blindInput, setBlindInput] = useState('');
  const [blindTTSParams, setBlindTTSParams] = useState({ rate: 1.0, voiceLang: 'en-IN' });
  const [blindResult, setBlindResult] = useState(null); 

  const typingContainerRef = useRef(null);
  const caretRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const calculatedFontSize = 1 + (textSize / 100) * 3; 
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Inconsolata&family=Inter:wght@400;600&family=Kalam&family=Lora&family=Merriweather&family=Montserrat&family=Open+Sans&family=Playfair+Display&family=Poppins&family=Quicksand&family=Roboto+Mono&family=Source+Code+Pro&family=Ubuntu&family=Noto+Sans+Devanagari&family=Yatra+One&family=Mukta&family=Teko&family=Gotu&family=Halant&family=Hind&family=Rajdhani&family=Khand&family=Rozha+One&family=Sahitya&family=Aparajita&display=swap');
      :root { --bg-color: ${theme.bg}; --text-main: ${theme.main}; --text-sub: ${theme.sub}; --text-color: ${theme.text}; --text-error: ${theme.error}; --font-family: ${font.family}; }
      body { background-color: var(--bg-color); color: var(--text-color); font-family: var(--font-family); transition: background-color 0.3s ease, color 0.3s ease; margin: 0; padding: 0; overflow-x: hidden; }
      .typing-container { font-size: ${calculatedFontSize}rem; width: ${containerWidth}%; }
      .smooth-caret { position: absolute; top: 0; left: 0; width: 3px; height: 1.4em; background-color: var(--text-main); transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1); will-change: transform; pointer-events: none; z-index: 10; opacity: 1; animation: blink 1s infinite step-start; display: flex; justify-content: center; }
      .smooth-caret.typing { animation: none; opacity: 1; }
      @keyframes blink { 50% { opacity: 0; } }
      .caret-hint { position: absolute; bottom: 110%; font-size: 0.5em; padding: 2px 6px; border-radius: 4px; background-color: var(--text-main); color: var(--bg-color); font-weight: bold; opacity: 0; transition: opacity 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: var(--font-family); white-space: nowrap; pointer-events: none; }
      .smooth-caret.typing .caret-hint { opacity: 1; }
      .custom-scroll::-webkit-scrollbar { width: 6px; } .custom-scroll::-webkit-scrollbar-thumb { background-color: var(--text-sub); border-radius: 10px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme, font, textSize, containerWidth]);

  const startTestEnv = useCallback((overrideStatus) => {
    let wordCount = 40;
    if (appMode === 'learning') wordCount = 20;
    else if (mode === 'words') wordCount = wordConfig;
    else if (appMode === 'blind') wordCount = 100; 

    resetEngine(wordCount); 
    setTypedHistory([]); setCurrentWordInput(''); setActiveWordIndex(0); 
    
    const nextStatus = typeof overrideStatus === 'string' ? overrideStatus : 'idle';
    setStatus(nextStatus);

    setTimeLeft(mode === 'time' && appMode === 'default' ? timeConfig : 0);
    setKeystrokes({ correct: 0, incorrect: 0 }); setErrorMap({}); setLastPressedKeyStr(null);
    setBlindInput(''); setBlindResult(null); setScrollOffset(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus();

    if (appMode === 'blind') {
      setBlindTTSParams(p => ({ ...p, voiceLang: language.includes('mangal') || language.includes('krutidev') ? 'hi-IN' : 'en-IN' }));
    }
  }, [resetEngine, mode, wordConfig, timeConfig, appMode, language]);

  useEffect(() => { 
    if (appMode !== 'home') startTestEnv('idle'); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode, language]);

  useEffect(() => {
    if (appMode === 'default' && mode === 'time' && status === 'running' && words.length > 0) {
      if (activeWordIndex >= words.length - 15) appendWords(20); 
    }
  }, [activeWordIndex, words.length, mode, status, appendWords, appMode]);

  // Caret Position Sync & Smart Auto-Scroll via Translation
  useEffect(() => {
    if (appMode === 'blind' || appMode === 'learning' || !caretRef.current || !typingContainerRef.current || status === 'finished') return;
    const container = typingContainerRef.current;
    const caret = caretRef.current;
    const hint = caret.querySelector('.caret-hint');
    
    caret.classList.add('typing'); clearTimeout(caret.blinkTimeout);
    caret.blinkTimeout = setTimeout(() => caret.classList.remove('typing'), 500);

    const activeWordEl = container.querySelector('.word.active');
    if (activeWordEl) {
      const top = activeWordEl.offsetTop;
      if (top > 50) setScrollOffset(top - 50); 
      else setScrollOffset(0);

      let targetEl = activeWordEl.querySelector('.letter.expected');
      let isEndOfWord = false;
      if (!targetEl) {
        const letters = activeWordEl.querySelectorAll('.letter'); targetEl = letters[letters.length - 1]; isEndOfWord = true;
      }
      
      let x = activeWordEl.offsetLeft;
      let y = activeWordEl.offsetTop;

      if (targetEl) {
        x += targetEl.offsetLeft;
        y += targetEl.offsetTop + (targetEl.offsetHeight * 0.1); 
        if (isEndOfWord) x += targetEl.offsetWidth;
        caret.style.transform = `translate(${x}px, ${y}px)`;

        if (hint) {
          if (!isEndOfWord) {
            const wordString = words[activeWordIndex];
            if (wordString && currentWordInput.length < wordString.length) {
              let char = wordString[currentWordInput.length];
              if (/^\p{M}$/u.test(char)) char = '◌' + char; 
              hint.textContent = char; hint.style.opacity = '1';
            }
          } else { hint.textContent = '␣'; hint.style.opacity = '1'; }
        }
      }
    }
  }, [currentWordInput, activeWordIndex, words, status, appMode]);

  const upcomingChars = useMemo(() => {
    if (appMode !== 'learning' || status === 'finished' || status === 'idle') return ['', '', ''];
    let chars = [];
    let wIdx = activeWordIndex;
    let cIdx = currentWordInput.length;
    
    while (chars.length < 3 && wIdx < words.length) {
      const word = words[wIdx];
      if (cIdx < word.length) {
        chars.push(word[cIdx]);
        cIdx++;
      } else {
        chars.push(' ');
        wIdx++;
        cIdx = 0;
      }
    }
    while (chars.length < 3) chars.push('');
    return chars;
  }, [appMode, status, activeWordIndex, currentWordInput, words]);

  const startTimer = () => {
    setStatus('running');
    if (appMode === 'default' && mode === 'time') {
      timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { endTest(); return 0; } return prev - 1; }); }, 1000);
    } else {
      timerRef.current = setInterval(() => { setTimeLeft(prev => prev + 1); }, 1000);
    }
  };

  const endTest = () => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (appMode === 'learning') {
      const res = calculateResults();
      if (res.accuracy >= 85) {
        let langKey = 'english';
        if (language.includes('krutidev')) langKey = 'krutidev';
        else if (language.includes('mangal')) langKey = 'hindi';
        
        if (activeLesson >= (learningProgress[langKey] || 0)) {
          setLearningProgress(prev => ({ ...prev, [langKey]: (prev[langKey] || 0) + 1 }));
        }
      }
    }
  };

  const handleDefaultKeyDown = useCallback((e) => {
    if (status === 'finished' || showSettings || !isReady || appMode === 'home') return;
    if (status === 'idle' && appMode === 'blind') return;

    if (e.key === 'Tab') { e.preventDefault(); startTestEnv(appMode === 'learning' ? 'ready' : 'idle'); return; }
    if (e.key === 'Enter' && appMode !== 'blind') { e.preventDefault(); startTestEnv(appMode === 'learning' ? 'ready' : 'idle'); return; }
    
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Dead'].includes(e.key)) { if(e.key === 'Shift') setLastPressedKeyStr('Shift'); return; }

    if ((status === 'idle' || status === 'ready') && e.key.length === 1) startTimer();

    if (appMode === 'blind') {
      if (status === 'ready') speakWord(words[activeWordIndex]);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expected = words[activeWordIndex] || '';
        const isCorrect = blindInput === expected;
        setBlindResult({ correct: isCorrect, expected, typed: blindInput });
        
        if (isCorrect) setKeystrokes(k => ({ correct: k.correct + expected.length, incorrect: k.incorrect }));
        else setKeystrokes(k => ({ correct: k.correct, incorrect: k.incorrect + expected.length }));

        if (soundEnabled) playSound(soundTheme, !isCorrect);

        setTimeout(() => {
          setBlindResult(null); setBlindInput(''); setActiveWordIndex(idx => idx + 1);
          speakWord(words[activeWordIndex + 1] || '');
        }, 1500);
        return;
      }
      if (e.key === 'Backspace') { setBlindInput(prev => prev.slice(0, -1)); return; }
      if (e.key.length === 1) { setBlindInput(prev => prev + e.key); setLastPressedKeyStr(e.key); if (soundEnabled) playSound(soundTheme, false); }
      return;
    }

    const currentWord = words[activeWordIndex];
    if (!currentWord) return;
    setLastPressedKeyStr(e.key);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentWordInput.length > 0) setCurrentWordInput(prev => prev.slice(0, -1));
      else if (activeWordIndex > 0) {
        const prevWord = words[activeWordIndex - 1]; const prevInput = typedHistory[activeWordIndex - 1] || '';
        if (prevInput !== prevWord) { setActiveWordIndex(activeWordIndex - 1); setCurrentWordInput(prevInput); setTypedHistory(prev => prev.slice(0, -1)); }
      }
      return;
    }

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (currentWordInput.length === 0) return; 
      setTypedHistory(prev => [...prev, currentWordInput]);
      
      const targetCount = appMode === 'learning' ? 20 : wordConfig;
      if ((appMode === 'default' && mode === 'words' && activeWordIndex === targetCount - 1) || (appMode === 'learning' && activeWordIndex === targetCount - 1)) {
        endTest();
      } else { setActiveWordIndex(idx => idx + 1); setCurrentWordInput(''); }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const expChar = currentWord[currentWordInput.length];
      if (e.key === expChar) { if (soundEnabled) playSound(soundTheme, false); setKeystrokes(k => ({ ...k, correct: k.correct + 1 })); } 
      else { if (soundEnabled) playSound(soundTheme, true); setKeystrokes(k => ({ ...k, incorrect: k.incorrect + 1 })); if (expChar) setErrorMap(prev => ({ ...prev, [expChar]: (prev[expChar] || 0) + 1 })); }
      setCurrentWordInput(prev => prev + e.key);
    }
  }, [status, isReady, words, activeWordIndex, currentWordInput, typedHistory, mode, soundEnabled, soundTheme, showSettings, startTestEnv, appMode, blindInput]);

  useEffect(() => { window.addEventListener('keydown', handleDefaultKeyDown); return () => window.removeEventListener('keydown', handleDefaultKeyDown); }, [handleDefaultKeyDown]);

  const speakWord = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = blindTTSParams.voiceLang;
    utterance.rate = blindTTSParams.rate;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
       const exactVoice = voices.find(v => v.lang === blindTTSParams.voiceLang);
       if (exactVoice) utterance.voice = exactVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const calculateResults = useCallback(() => {
    const totalTimeSeconds = (appMode === 'default' && mode === 'time') ? (timeConfig - timeLeft) : timeLeft;
    const totalTimeMinutes = totalTimeSeconds / 60; 
    const totalCharsTyped = keystrokes.correct + keystrokes.incorrect;
    
    let correctWordsCount = 0;
    typedHistory.forEach((typed, i) => { if (typed === words[i]) correctWordsCount++; });
    if (status === 'finished' && currentWordInput === words[activeWordIndex]) correctWordsCount++;

    const wpmGross = totalTimeMinutes > 0 ? Math.round((totalCharsTyped / 5) / totalTimeMinutes) : 0;
    const wpmNet = totalTimeMinutes > 0 ? Math.round((keystrokes.correct / 5) / totalTimeMinutes) : 0;
    const accuracy = totalCharsTyped > 0 ? Math.round((keystrokes.correct / totalCharsTyped) * 100) : 0;
    const weakKeys = Object.entries(errorMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    return { wpmNet, wpmGross, accuracy, correctWordsCount, weakKeys, totalTimeSeconds };
  }, [status, keystrokes, typedHistory, timeLeft, timeConfig, mode, errorMap, words, activeWordIndex, currentWordInput, appMode]);

  const results = useMemo(() => calculateResults(), [calculateResults]);

  const renderedWordList = useMemo(() => {
    if (appMode === 'learning') return null; 
    return words.map((word, index) => {
      const isActive = index === activeWordIndex;
      const isTyped = index < activeWordIndex;
      const typed = isTyped ? (typedHistory[index] || '') : (isActive ? (currentWordInput || '') : '');
      return <MemoizedWord key={index} word={word || ''} typed={typed} isActive={isActive} />;
    });
  }, [words, activeWordIndex, typedHistory, currentWordInput, appMode]);

  const renderKeyboard = () => {
    const isHindi = language.includes('mangal') || language.includes('krutidev');
    const currentWord = words[activeWordIndex] || '';
    const expectedChar = appMode === 'blind' ? null : (currentWord ? currentWord[currentWordInput.length] : null);

    let expectedCode = null; let expectedRequiresShift = false;
    if (expectedChar === undefined || expectedChar === ' ') expectedCode = 'Space';
    else if (expectedChar) {
       for (const row of KEYBOARD_LAYOUT) {
          for (const key of row) {
             if (isHindi) {
                if (key.hi === expectedChar) { expectedCode = key.code; expectedRequiresShift = false; }
                if (key.hiShift === expectedChar) { expectedCode = key.code; expectedRequiresShift = true; }
             } else {
                if (key.en === expectedChar) { expectedCode = key.code; expectedRequiresShift = false; }
                if (key.enShift === expectedChar) { expectedCode = key.code; expectedRequiresShift = true; }
             }
          }
       }
    }

    return (
      <div className="mt-4 flex flex-col items-center gap-1.5 w-full mx-auto p-4 sm:p-6 rounded-2xl bg-[var(--text-sub)]/5 border border-[var(--text-sub)]/10 shadow-lg backdrop-blur-sm transition-all duration-300">
        {KEYBOARD_LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 w-full justify-center">
            {row.map((key) => {
              const isExpected = expectedCode === key.code || (expectedRequiresShift && key.code.includes('Shift'));
              let isLastPressed = false;
              if (lastPressedKeyStr) {
                if (key.code.includes('Shift') && lastPressedKeyStr === 'Shift') isLastPressed = true;
                else if (isHindi && (key.hi === lastPressedKeyStr || key.hiShift === lastPressedKeyStr)) isLastPressed = true;
                else if (!isHindi && (key.en === lastPressedKeyStr || key.enShift === lastPressedKeyStr)) isLastPressed = true;
                else if (key.display === lastPressedKeyStr) isLastPressed = true;
                else if (lastPressedKeyStr.toLowerCase() === key.en) isLastPressed = true;
              }

              let bgClass = "bg-[var(--bg-color)] border-[var(--text-sub)]/30"; let textClass = "text-[var(--text-sub)]";
              if (isExpected && appMode !== 'blind') { bgClass = "bg-[var(--text-main)]/20 border-[var(--text-main)]"; textClass = "text-[var(--text-main)] font-bold"; } 
              else if (isLastPressed) { bgClass = "bg-[var(--text-sub)]/30 border-[var(--text-sub)]"; }

              if (key.isSpecial) return (
                <div key={key.code} className={`flex items-center justify-center ${key.width} h-10 sm:h-12 rounded-md border-b-4 uppercase transition-all duration-100 ${bgClass} ${textClass} ${isLastPressed ? 'translate-y-1 border-b-0 h-9 sm:h-11 mt-1' : ''}`} style={{ fontSize: '0.7rem' }}>{key.display}</div>
              );

              return (
                <div key={key.code} className={`flex flex-col justify-between w-8 sm:w-12 h-10 sm:h-12 rounded-md border-b-4 p-1 px-1.5 transition-all duration-100 ${bgClass} ${textClass} ${isLastPressed ? 'translate-y-1 border-b-0 h-9 sm:h-11 mt-1' : ''}`}>
                  <span className={`text-left text-[0.6rem] sm:text-xs font-semibold ${isExpected && expectedRequiresShift ? 'text-[var(--text-main)] scale-110' : 'opacity-70'}`}>{isHindi ? key.hiShift : key.enShift}</span>
                  <span className={`text-right text-xs sm:text-base font-bold ${isExpected && !expectedRequiresShift ? 'text-[var(--text-main)] scale-110' : ''}`}>{isHindi ? key.hi : key.en}</span>
                </div>
              );
            })}
          </div>
        ))}
        <div className={`mt-1 flex items-center justify-center w-[60%] sm:w-[50%] h-10 sm:h-12 rounded-md border-b-4 transition-all duration-100 ${expectedCode === 'Space' && appMode !== 'blind' ? 'bg-[var(--text-main)]/20 border-[var(--text-main)] text-[var(--text-main)] font-bold' : 'bg-[var(--bg-color)] border-[var(--text-sub)]/30 text-[var(--text-sub)]'} ${lastPressedKeyStr === ' ' ? 'translate-y-1 border-b-0 h-9 sm:h-11 mt-2' : ''}`} style={{ fontSize: '0.8rem' }}>SPACE</div>
      </div>
    );
  };

  const handleLearningLang = (langId) => {
    setLanguage(langId);
    setActiveLesson(0);
    if (langId === 'hindi_krutidev') setFont(FONTS.find(f => f.id === 'krutidev'));
    else if (langId.includes('mangal')) setFont(FONTS.find(f => f.id === 'mangal'));
    else setFont(FONTS.find(f => f.id === 'inter'));
  };

  const blindGraphemes = useMemo(() => {
    if (!blindInput) return [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
       return Array.from(new Intl.Segmenter(language.includes('mangal') || language.includes('krutidev') ? 'hi-IN' : 'en-US', { granularity: 'grapheme' }).segment(blindInput)).map(s => {
           let seg = s.segment;
           if (/^\p{M}$/u.test(seg)) return '◌' + seg;
           return seg;
       });
    }
    return blindInput.split('').map(c => /^\p{M}$/u.test(c) ? '◌'+c : c);
  }, [blindInput, language]);

  if (appMode === 'home') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-color)]">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <Type size={64} className="text-[var(--text-main)] mx-auto mb-6" strokeWidth={2.5}/>
           <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tight mb-3">TezzTyping <span className="text-[var(--text-sub)]">PRO</span></h1>
           <p className="text-lg text-[var(--text-sub)] max-w-lg mx-auto">Master touch-typing with structured courses, auditory blind training, and zero-latency grapheme rendering.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          <button onClick={() => setAppMode('learning')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><GraduationCap size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Learning Curriculum</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">Structured 30-lesson courses from beginner basics to advanced punctuation. All levels unlocked.</p>
          </button>
          
          <button onClick={() => setAppMode('default')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Gamepad2 size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Arcade Mode</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">The classic zero-latency typing sandbox. Endless words, timed tests, and hardcore AI mutations.</p>
          </button>
          
          <button onClick={() => setAppMode('blind')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Headphones size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Blind Auditory Mode</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">No visuals. Pure audio TTS dictation. Test your true muscle memory by typing what you hear.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8" onClick={() => inputRef.current?.focus()}>
      <input ref={inputRef} type="text" className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none" onBlur={() => { if(status === 'running') inputRef.current?.focus() }} />

      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-4 select-none">
          <button onClick={() => setAppMode('home')} className="p-3 bg-[var(--text-sub)]/10 rounded-xl hover:bg-[var(--text-main)]/20 hover:text-[var(--text-main)] transition-colors"><ArrowLeft size={24} /></button>
          <div><h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight capitalize">{appMode} Mode</h1><p className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider">{language.replace(/_/g, ' ')}</p></div>
        </div>
        <div className="flex items-center gap-4 text-[var(--text-sub)]">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:text-[var(--text-main)] transition-colors p-2">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
          <button onClick={() => setShowSettings(true)} className="hover:text-[var(--text-main)] transition-colors p-2"><Settings size={20} /></button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col justify-center items-center">
        
        {appMode === 'learning' && status === 'idle' && !showSettings && (
          <div className="w-full max-w-4xl mb-12 animate-in fade-in">
            <div className="mb-8 p-6 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/10 text-center">
               <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Choose Course Language</h3>
               <div className="flex flex-wrap justify-center gap-4">
                 <button onClick={() => handleLearningLang('english_normal')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language === 'english_normal' ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>English</button>
                 <button onClick={() => handleLearningLang('hindi_mangal_inscript')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language === 'hindi_mangal_inscript' ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>Hindi (Mangal)</button>
                 <button onClick={() => handleLearningLang('hindi_krutidev')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language === 'hindi_krutidev' ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>Hindi (Krutidev)</button>
               </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-3"><GraduationCap /> Curriculum Modules</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {LEARNING_PHASES[language.includes('krutidev') ? 'krutidev' : language.includes('mangal') ? 'hindi' : 'english'].map((lesson, idx) => {
                const isUnlocked = true;
                const isSelected = activeLesson === idx;
                return (
                  <button key={idx} disabled={!isUnlocked} onClick={() => { setActiveLesson(idx); }}
                    className={`p-3 rounded-xl border text-sm flex flex-col items-center gap-2 transition-all ${isSelected ? 'border-[var(--text-main)] bg-[var(--text-main)]/10 text-[var(--text-main)] shadow-md' : 'border-[var(--text-sub)]/30 hover:border-[var(--text-main)] hover:bg-[var(--text-sub)]/10'}`}>
                    <span className="font-bold">L{idx + 1}</span>
                    {isUnlocked ? <span className="text-[10px] truncate w-full text-center opacity-80">{lesson.name}</span> : <LockKeyhole size={14}/>}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 p-4 bg-[var(--text-sub)]/10 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--text-main)] text-lg">{LEARNING_PHASES[language.includes('krutidev') ? 'krutidev' : language.includes('mangal') ? 'hindi' : 'english'][activeLesson].name}</p>
                <p className="text-sm text-[var(--text-sub)] mt-1">Goal: 85% Accuracy to pass lesson.</p>
              </div>
              <button onClick={() => { startTestEnv('ready'); }} className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-color)] rounded-lg font-bold hover:opacity-90 flex items-center gap-2"><Play size={18}/> Start Lesson</button>
            </div>
          </div>
        )}

        {appMode === 'learning' && (status === 'running' || status === 'ready') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 flex flex-col items-center w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4 font-bold text-[var(--text-main)] w-full" style={{ fontSize: '1.2rem' }}>
              <div>{`${activeWordIndex}/${20}`}</div>
              <div className="text-[var(--text-sub)] font-medium flex gap-4" style={{ fontSize: '1rem' }}><span>WPM: {results.wpmNet || 0}</span><span>ACC: {results.accuracy || 100}%</span></div>
            </div>

            {!isReady ? (
               <div className="flex justify-center items-center h-[180px] text-[var(--text-sub)] animate-pulse w-full">Loading Engine...</div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full my-6 animate-in fade-in duration-500">
                 <div className="text-[var(--text-sub)] mb-4 text-sm uppercase tracking-widest font-bold">Upcoming Keystrokes</div>
                 <div className="flex gap-4 sm:gap-6">
                   {upcomingChars.map((ch, i) => {
                      let displayCh = ch === ' ' ? '␣' : ch;
                      if (displayCh && /^\p{M}$/u.test(displayCh)) displayCh = '◌' + displayCh;
                      
                      return (
                        <div key={i} className={`flex items-center justify-center w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-4 text-4xl sm:text-6xl font-bold transition-all duration-200 ${i === 0 ? 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--text-main)]/10 scale-110 shadow-[0_0_20px_rgba(0,0,0,0.1)] shadow-[var(--text-main)]/20 z-10' : 'border-[var(--text-sub)]/20 text-[var(--text-sub)] opacity-60 scale-90'}`}>
                          {displayCh}
                        </div>
                      );
                   })}
                 </div>
              </div>
            )}

            <div className="w-full mt-2">
               {renderKeyboard()}
            </div>

            <div className="text-center mt-6 text-[var(--text-sub)] opacity-50 hover:opacity-100 transition-opacity w-full">
               <button onClick={() => startTestEnv('idle')} className="flex items-center justify-center gap-2 mx-auto hover:text-[var(--text-main)]">
                 <ArrowLeft size={16} /> Exit Lesson
               </button>
            </div>
          </div>
        )}

        {appMode === 'default' && status === 'idle' && !showSettings && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium text-[var(--text-sub)] bg-[var(--text-sub)]/5 py-3 px-6 rounded-2xl backdrop-blur-md border border-[var(--text-sub)]/10">
            <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
              <button onClick={() => setMode('time')} className={`hover:text-[var(--text-main)] ${mode === 'time' ? 'text-[var(--text-main)]' : ''}`}>Time</button>
              <button onClick={() => setMode('words')} className={`hover:text-[var(--text-main)] ${mode === 'words' ? 'text-[var(--text-main)]' : ''}`}>Words</button>
            </div>
            <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
              {mode === 'time' ? ([15, 30, 60, 120].map(val => ( <button key={val} onClick={() => setTimeConfig(val)} className={`hover:text-[var(--text-main)] ${timeConfig === val ? 'text-[var(--text-main)]' : ''}`}>{val}</button> ))) : ( [10, 25, 50, 100].map(val => ( <button key={val} onClick={() => setWordConfig(val)} className={`hover:text-[var(--text-main)] ${wordConfig === val ? 'text-[var(--text-main)]' : ''}`}>{val}</button> )) )}
            </div>
            <div className="flex gap-3 items-center">
               {['easy', 'medium', 'hard', 'pro'].map(level => (
                  <button key={level} onClick={() => setDifficulty(level)} className={`hover:text-[var(--text-main)] capitalize ${difficulty === level ? 'text-[var(--text-main)] font-bold bg-[var(--text-main)]/10 px-3 py-1 rounded-lg' : 'px-3 py-1'}`}>{level}</button>
               ))}
            </div>
          </div>
        )}

        {appMode === 'blind' && status === 'idle' && !showSettings && (
          <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/10 max-w-xl w-full">
             <div className="w-full text-center mb-2"><Headphones size={32} className="mx-auto text-[var(--text-main)] mb-2"/><p className="text-[var(--text-sub)] text-sm">Press Space or Enter to submit word.</p></div>
             
             <div className="flex justify-center gap-3 items-center w-full mb-2">
               {['easy', 'medium', 'hard', 'pro'].map(level => (
                  <button key={level} onClick={() => setDifficulty(level)} className={`hover:text-[var(--text-main)] capitalize ${difficulty === level ? 'text-[var(--text-main)] font-bold bg-[var(--text-main)]/10 px-3 py-1 rounded-lg' : 'px-3 py-1'}`}>{level}</button>
               ))}
             </div>

             <div className="flex items-center gap-4 w-full">
               <span className="text-[var(--text-sub)] text-sm font-bold w-24">TTS Speed</span>
               <input type="range" min="0.5" max="2.0" step="0.1" value={blindTTSParams.rate} onChange={(e) => setBlindTTSParams(p => ({...p, rate: parseFloat(e.target.value)}))} className="w-full accent-[var(--text-main)]" />
               <span className="text-[var(--text-main)] text-sm font-bold">{blindTTSParams.rate}x</span>
             </div>
             <button onClick={() => { startTestEnv('ready'); startTimer(); speakWord(words[activeWordIndex]); }} className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-color)] rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90"><PlayCircle/> Start Dictation</button>
          </div>
        )}

        {appMode === 'default' && (status === 'running' || status === 'ready' || status === 'idle') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 typing-container flex flex-col items-center w-full max-w-5xl">
            <div className="flex justify-between items-center mb-6 font-bold text-[var(--text-main)] w-full" style={{ fontSize: '1.2rem' }}>
              <div>{mode === 'time' ? timeLeft : (`${activeWordIndex}/${wordConfig}`)}</div>
              <div className="text-[var(--text-sub)] font-medium flex gap-4" style={{ fontSize: '1rem' }}><span>WPM: {results.wpmNet || 0}</span><span>ACC: {results.accuracy || 100}%</span></div>
            </div>
            {!isReady ? (
               <div className="flex justify-center items-center h-[180px] text-[var(--text-sub)] animate-pulse w-full">Loading Engine...</div>
            ) : (
              <div ref={typingContainerRef} className="h-[200px] overflow-hidden relative select-none w-full" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)' }}>
                <div className="flex flex-wrap content-start items-center relative z-0 pb-32" style={{ transform: `translateY(-${scrollOffset}px)`, transition: 'transform 0.2s ease-out' }}>
                   <div ref={caretRef} className="smooth-caret"><div className="caret-hint"></div></div>
                   {renderedWordList}
                </div>
              </div>
            )}
            <div className="w-full mt-4">{renderKeyboard()}</div>
            <div className="text-center mt-8 text-[var(--text-sub)] opacity-50 hover:opacity-100 transition-opacity w-full"><button onClick={() => startTestEnv('idle')} className="flex items-center justify-center gap-2 mx-auto hover:text-[var(--text-main)]"><RefreshCcw size={16} /> Restart</button></div>
          </div>
        )}

        {appMode === 'blind' && (status === 'running' || status === 'ready') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 typing-container flex flex-col items-center w-full max-w-3xl">
             <div className="flex justify-between items-center w-full mb-10 text-[var(--text-sub)] text-xl font-bold">
               <span>Dictation Mode</span> <span>{timeLeft}s</span>
             </div>
             
             {blindResult && (
               <div className={`text-2xl font-bold mb-4 ${blindResult.correct ? 'text-[var(--text-main)]' : 'text-[var(--text-error)]'}`}>
                 {blindResult.correct ? 'Correct!' : `Expected: ${blindResult.expected}`}
               </div>
             )}

             <div className="w-full flex items-center justify-center h-32 border-b-4 border-[var(--text-sub)]/30 text-5xl tracking-widest text-[var(--text-main)] font-mono relative">
                {blindGraphemes.map((char, i) => (
                  <span key={i} className="animate-in zoom-in duration-100">{char}</span>
                ))}
                {!blindResult && <span className="w-4 h-12 bg-[var(--text-main)] animate-pulse ml-2"></span>}
             </div>
             
             <div className="mt-8 flex gap-4 w-full justify-center">
               <button onClick={() => speakWord(words[activeWordIndex])} className="px-6 py-3 rounded-xl bg-[var(--text-sub)]/10 text-[var(--text-main)] font-bold flex items-center gap-2 hover:bg-[var(--text-sub)]/20"><Rewind size={20}/> Replay Audio</button>
             </div>

             <div className="w-full mt-8">{renderKeyboard()}</div>
             <div className="text-center mt-8 text-[var(--text-sub)]"><button onClick={endTest} className="hover:text-[var(--text-main)]">End Session</button></div>
          </div>
        )}

        {status === 'finished' && (
          <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-[var(--text-sub)]/5 border border-[var(--text-sub)]/10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
             <h2 className="text-3xl font-bold text-center text-[var(--text-main)] mb-10">Test Completed</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Net WPM</div><div className="text-5xl font-black text-[var(--text-main)]">{results.wpmNet}</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Accuracy</div><div className="text-5xl font-black text-[var(--text-main)]">{results.accuracy}%</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Time (s)</div><div className="text-5xl font-black text-[var(--text-color)]">{results.totalTimeSeconds}</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Gross WPM</div><div className="text-5xl font-black text-[var(--text-color)] opacity-70">{results.wpmGross}</div></div>
             </div>

             {appMode === 'learning' && (
               <div className={`p-6 rounded-2xl mb-8 border flex items-center justify-between ${results.accuracy >= 85 ? 'bg-[var(--text-main)]/10 border-[var(--text-main)]/30' : 'bg-[var(--text-error)]/10 border-[var(--text-error)]/30'}`}>
                 <div>
                   <h3 className={`text-xl font-bold ${results.accuracy >= 85 ? 'text-[var(--text-main)]' : 'text-[var(--text-error)]'}`}>{results.accuracy >= 85 ? 'Lesson Passed!' : 'Try Again'}</h3>
                   <p className="text-[var(--text-sub)] text-sm">You need 85% accuracy to pass this lesson.</p>
                 </div>
                 {results.accuracy >= 85 && <button onClick={() => { setActiveLesson(prev => prev + 1); setTimeout(() => { startTestEnv('ready'); }, 50); }} className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-color)] font-bold rounded-lg hover:opacity-90">Next Lesson</button>}
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-main)]/10 rounded-xl border border-[var(--text-main)]/20"><div className="text-xs text-[var(--text-main)] font-semibold uppercase tracking-wider mb-1">Correct Keystrokes</div><div className="text-2xl font-bold text-[var(--text-main)]">{keystrokes.correct}</div></div>
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-error)]/10 rounded-xl border border-[var(--text-error)]/20"><div className="text-xs text-[var(--text-error)] font-semibold uppercase tracking-wider mb-1">Incorrect Keystrokes</div><div className="text-2xl font-bold text-[var(--text-error)]">{keystrokes.incorrect}</div></div>
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-sub)]/10 rounded-xl border border-[var(--text-sub)]/20"><div className="text-xs text-[var(--text-color)] font-semibold uppercase tracking-wider mb-1">Words Typed</div><div className="text-2xl font-bold text-[var(--text-color)]">{results.correctWordsCount}</div></div>
             </div>

             <div className="flex justify-center gap-4">
               {appMode === 'learning' && <button onClick={() => startTestEnv('idle')} className="px-8 py-4 bg-[var(--text-sub)]/20 text-[var(--text-color)] font-bold rounded-xl hover:bg-[var(--text-sub)]/30 transition-all">Back to Lessons</button>}
               <button onClick={() => startTestEnv(appMode === 'learning' ? 'ready' : 'idle')} className="px-8 py-4 bg-[var(--text-main)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[var(--text-main)]/20 transition-all"><RefreshCcw size={20} className="inline mr-2" /> {appMode === 'learning' ? 'Retry Lesson' : 'Next Test'}</button>
             </div>
          </div>
        )}
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) setShowSettings(false); }}>
          <div className="bg-[var(--bg-color)] border border-[var(--text-sub)]/20 p-8 rounded-3xl w-full max-w-5xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scroll">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--text-sub)]/10 sticky top-0 bg-[var(--bg-color)] z-10 pt-2">
              <h2 className="text-3xl font-bold flex items-center gap-3"><Sliders className="text-[var(--text-main)]" size={28} /> Customization Lab</h2>
              <button onClick={() => { setShowSettings(false); if(appMode !== 'home') startTestEnv(appMode === 'learning' ? 'idle' : 'idle'); }} className="p-2 hover:bg-[var(--text-sub)]/10 rounded-full transition-colors"><RefreshCcw size={24} className="rotate-45" /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Type size={16}/> Font Family (30+)</h3>
                  <div className="h-64 overflow-y-auto pr-2 space-y-2 border border-[var(--text-sub)]/20 rounded-xl p-2 bg-[var(--text-sub)]/5 custom-scroll">
                    {FONTS.map(f => ( <button key={f.id} onClick={() => setFont(f)} style={{ fontFamily: f.family }} className={`w-full text-left p-3 rounded-lg text-sm transition-all ${font.id === f.id ? 'bg-[var(--text-main)] text-[var(--bg-color)] font-bold' : 'hover:bg-[var(--text-sub)]/10'}`}>{f.name}</button> ))}
                  </div>
                </div>
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Maximize size={16}/> Text Scale & Display</h3>
                   <div className="space-y-6 bg-[var(--text-sub)]/5 p-4 rounded-xl border border-[var(--text-sub)]/20">
                     <div><div className="flex justify-between text-xs mb-2 text-[var(--text-sub)]"><span>Font Size</span><span>{textSize}%</span></div><input type="range" min="0" max="100" value={textSize} onChange={(e) => setTextSize(e.target.value)} className="w-full accent-[var(--text-main)]" /></div>
                     <div><div className="flex justify-between text-xs mb-2 text-[var(--text-sub)]"><span>Container Width</span><span>{containerWidth}%</span></div><input type="range" min="50" max="100" value={containerWidth} onChange={(e) => setContainerWidth(e.target.value)} className="w-full accent-[var(--text-main)]" /></div>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Keyboard size={16}/> Active Dictionary</h3>
                  <div className="flex flex-col gap-2">
                    {Object.keys(DICTIONARY_API_MOCK).map(lang => ( <button key={lang} onClick={() => setLanguage(lang)} className={`p-3 text-left rounded-xl border text-sm transition-all ${language === lang ? 'bg-[var(--text-main)]/10 border-[var(--text-main)] text-[var(--text-main)] font-semibold' : 'border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/5'}`}>{lang.replace(/_/g, ' ').toUpperCase()}</button> ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Volume2 size={16}/> Audio Synthesizer</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SOUND_THEMES.map(themeName => ( <button key={themeName} onClick={() => {setSoundTheme(themeName); playSound(themeName, false);}} className={`p-3 text-left rounded-xl border text-sm transition-all capitalize ${soundTheme === themeName ? 'bg-[var(--text-main)]/10 border-[var(--text-main)] text-[var(--text-main)] font-semibold' : 'border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/5'}`}>{themeName.replace('_', ' ')}</button> ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Sun size={16}/> Aesthetics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(THEMES).map(t => ( <button key={t.id} onClick={() => setTheme(t)} className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${theme.id === t.id ? 'border-[var(--text-main)] ring-1 ring-[var(--text-main)] font-semibold' : 'border-transparent hover:bg-[var(--text-sub)]/5'}`} style={{ backgroundColor: t.bg, color: t.text }}><div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.main }}></div> {t.name}</button> ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end sticky bottom-0 bg-[var(--bg-color)] py-4 border-t border-[var(--text-sub)]/10">
               <button onClick={() => { setShowSettings(false); if(appMode !== 'home') startTestEnv(appMode === 'learning' ? 'idle' : 'idle'); }} className="px-8 py-3 bg-[var(--text-main)] text-[var(--bg-color)] rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Apply Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}