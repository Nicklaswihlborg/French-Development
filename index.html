import React, { useEffect, useMemo, useRef, useState } from "react";

// =============================================================
// French B2 App — v2 (news, charts, gradient)
// - Gradient background
// - Speaking button fixed with diagnostics (ASR)
// - Upgraded progress tracking (sparkline, activity bars, heatmap)
// - Comprehension tab with news fetch (RSS via CORS proxy fallback),
//   simplify, listen (TTS), translate (popup), and quick questions
// - LocalStorage persistence + export/import
// =============================================================

// ---------------- Helpers ----------------
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => new Date(d).toLocaleDateString();
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const daysBetween = (a, b) => Math.round((b - a) / (1000 * 60 * 60 * 24));
const uid = () => Math.random().toString(36).slice(2, 10);

// Simple similarity (Jaccard on words)
function similarity(a, b) {
  const A = new Set((a || "").toLowerCase().split(/[^\p{L}\p{M}]+/u).filter(Boolean));
  const B = new Set((b || "").toLowerCase().split(/[^\p{L}\p{M}]+/u).filter(Boolean));
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / new Set([...A, ...B]).size;
}

// Storage
const STORAGE_KEY = "french.b2.v2";

const defaultState = {
  profile: {
    name: "",
    currentLevel: "A2",
    targetLevel: "B2",
    weeklyHoursGoal: 7,
    targetDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
  },
  ui: { tab: "agenda" },
  schedule: {
    byDay: {
      1: { minutes: 60, focus: "Speaking + Vocab" },
      2: { minutes: 45, focus: "Grammar + Vocab" },
      3: { minutes: 60, focus: "Listening + Shadowing" },
      4: { minutes: 45, focus: "Writing + Vocab" },
      5: { minutes: 60, focus: "Speaking + Review" },
      6: { minutes: 30, focus: "Free choice / fun" },
      0: { minutes: 30, focus: "Light review or rest" },
    },
  },
  // {id, date:"YYYY-MM-DD", minutes, activity:"Speaking|Listening|Grammar|Writing|Vocab|Reading|Review"}
  studyLog: [],
  speakingPrompts: [
    { id: uid(), topic: "Se présenter", text: "Présente-toi: d'où viens-tu, où habites-tu, ton travail, et tes loisirs." },
    { id: uid(), topic: "Plan du week-end", text: "Explique ce que tu vas faire ce week-end et pourquoi." },
    { id: uid(), topic: "Problème client", text: "Appelle un service client: ton abonnement internet ne marche pas depuis hier." },
  ],
  vocab: [
    { id: uid(), fr: "malgré", en: "despite", part: "prep", EF: 2.5, interval: 1, due: todayISO() },
    { id: uid(), fr: "envisager", en: "to consider/plan", part: "verb", EF: 2.5, interval: 1, due: todayISO() },
  ],
  comprehension: {
    source: "France 24",
    title: "",
    text: "",
    simplified: "",
    questions: [], // {id, sentence, blank, answer}
  },
};

function usePersistentState() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultState;
    } catch (e) {
      console.warn("[state] failed to load", e);
      return defaultState;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("[state] failed to save", e);
    }
  }, [state]);
  return [state, setState];
}

// ---------------- Speech Recognition ----------------
function useSpeechRecognition({ lang = "fr-FR", onResult } = {}) {
  const [supported, setSupported] = useState(false);
  const [secure, setSecure] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recRef = useRef(null);
  const manualStopRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(SR));
    setSecure(window.isSecureContext === true);
    if (SR) {
      const rec = new SR();
      rec.lang = lang;
      rec.continuous = false; // ensure it doesn't auto-restart forever
      rec.onstart = () => {
        console.debug("[ASR] onstart");
        setListening(true);
      };
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const t = e.results?.[0]?.[0]?.transcript || "";
        console.debug("[ASR] result", t);
        onResult && onResult(t);
      };
      rec.onend = () => {
        console.debug("[ASR] end");
        setListening(false);
      };
      rec.onerror = (e) => {
        console.warn("[ASR] error", e);
        setError(e?.error || "unknown-error");
        setListening(false);
      };
      recRef.current = rec;
    }
  }, [lang, onResult]);

  const start = async () => {
    if (!recRef.current) return;
    setError("");
    if (!window.isSecureContext) {
      setError("secure_context_required");
      return;
    }
    // Preflight mic permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = e && e.name ? e.name : "";
      setError(
        name === "NotAllowedError" ? "permission_denied" :
        name === "NotFoundError"  ? "no_microphone" :
        "mic_error"
      );
      return;
    }
    try {
      console.info("[ASR] start() called");
      manualStopRef.current = false;
      setListening(true);
      recRef.current.start();
    } catch (e) {
      console.warn("[ASR] start failed", e);
      setError("start_failed");
      setListening(false);
    }
  };

  const stop = () => {
    if (!recRef.current) return;
    try {
      console.info("[ASR] stop() called");
      manualStopRef.current = true;
      recRef.current.stop();
      // Fallback: if onend doesn't fire promptly, force abort
      setTimeout(() => {
        if (listening) {
          console.warn("[ASR] forcing abort()");
          try { recRef.current.abort && recRef.current.abort(); } catch {}
          setListening(false);
        }
      }, 800);
    } catch (e) {
      console.warn("[ASR] stop failed", e);
      try { recRef.current.abort && recRef.current.abort(); } catch {}
      setListening(false);
    }
  };

  return { supported, secure, listening, error, start, stop };
}

// ---------------- Text-to-Speech (TTS) controller ----------------
function useTTS(defaultLang = "fr-FR") {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utterRef = React.useRef(null);
  const [speaking, setSpeaking] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    return () => {
      try { synth?.cancel(); } catch {}
    };
  }, [synth]);

  const speak = (text, lang = defaultLang) => {
    if (!synth || !text) return;
    try { synth.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onstart = () => { setSpeaking(true); setPaused(false); };
    u.onend = () => { setSpeaking(false); setPaused(false); utterRef.current = null; };
    u.onerror = () => { setSpeaking(false); setPaused(false); };
    utterRef.current = u;
    synth.speak(u);
  };

  const pause = () => {
    if (!synth) return;
    try { if (synth.speaking && !synth.paused) { synth.pause(); setPaused(true); } } catch {}
  };

  const resume = () => {
    if (!synth) return;
    try { if (synth.paused) { synth.resume(); setPaused(false); } } catch {}
  };

  const stop = () => {
// ---------------- Text-to-Speech (TTS) controller ----------------
function useTTS(defaultLang = "fr-FR") {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utterRef = React.useRef(null);
  const [speaking, setSpeaking] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    return () => { try { synth?.cancel(); } catch {} };
  }, [synth]);

  const speak = (text, lang = defaultLang) => {
    if (!synth || !text) return;
    try { synth.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onstart = () => { setSpeaking(true); setPaused(false); };
    u.onend = () => { setSpeaking(false); setPaused(false); utterRef.current = null; };
    u.onerror = () => { setSpeaking(false); setPaused(false); };
    utterRef.current = u;
    synth.speak(u);
  };

  const pause = () =card, q) {
  let { EF = 2.5, interval = 1 } = card;
  EF = Math.max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (q < 3) interval = 1; else interval = interval === 1 ? 2 : Math.round(interval * EF);
  const next = new Date();
  next.setDate(next.getDate() + interval);
  return { ...card, EF, interval, due: next.toISOString().slice(0, 10) };
}

// ---------------- UI Primitives ----------------
const Card = ({ title, right, children }) => (
  <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {right}
    </div>
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs border bg-white/60">{children}</span>
);

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-full border text-sm ${active ? "bg-black text-white" : "bg-white/70 hover:bg-white"}`}>{children}</button>
);

// ---------------- Charts (SVG, no deps) ----------------
function Sparkline({ data = [], width = 220, height = 60 }) {
  const max = Math.max(1, ...data);
  const step = width / Math.max(1, data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - (v / max) * (height - 8) - 4}`).join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

function Bars({ items = [], width = 260 }) {
  const max = Math.max(1, ...items.map((x) => x.value));
  return (
    <div className="space-y-1">
      {items.map((x) => (
        <div key={x.label} className="flex items-center gap-2">
          <div className="w-24 text-sm text-gray-700">{x.label}</div>
          <div className="h-3 rounded bg-gray-200 w-full">
            <div className="h-3 rounded bg-black" style={{ width: `${(x.value / max) * 100}%` }} />
          </div>
          <div className="w-10 text-right text-xs tabular-nums">{x.value}</div>
        </div>
      ))}
    </div>
  );
}

function Heatmap({ values = [], weeks = 8 }) {
  // values: map yyyy-mm-dd -> minutes
  const today = new Date();
  const cells = [];
  const days = weeks * 7;
  const allVals = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const v = values[iso] || 0;
    allVals.push(v);
    cells.push({ iso, v, dow: d.getDay() });
  }
  const max = Math.max(1, ...allVals);
  const color = (v) => `rgba(0,0,0,${0.12 + (v / max) * 0.68})`;
  return (
    <div className="grid grid-cols-8 gap-1">
      {[...Array(weeks)].map((_, w) => (
        <div key={w} className="grid grid-rows-7 gap-1">
          {cells.slice(w * 7, w * 7 + 7).map((c) => (
            <div key={c.iso} title={`${c.iso}: ${c.v} min`} className="w-5 h-5 rounded" style={{ background: color(c.v) }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------- Translate Popup ----------------
function TranslateButton({ text }) {
  const [busy, setBusy] = useState(false);
  const translate = async () => {
    if (!text) return;
    try {
      setBusy(true);
      console.info("[translate] requesting", text.slice(0, 80));
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|en`;
      const res = await fetch(url);
      const data = await res.json();
      const en = data?.responseData?.translatedText || "(no translation)";
      const popup = window.open("", "translationPopup", "width=560,height=420,scrollbars=yes");
      if (!popup) return alert("Please allow popups.");
      popup.document.write(`<!doctype html><html><head><title>Translation</title></head><body style="font-family:system-ui;padding:12px;line-height:1.5"><h3>French</h3><p>${text}</p><h3>English</h3><p>${en}</p></body></html>`);
    } catch (e) {
      console.warn("[translate] failed", e);
      alert("Translation failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button className="px-3 py-1.5 rounded-full border bg-white/70" onClick={translate} disabled={busy}>
      {busy ? "…" : "Translate"}
    </button>
  );
}

// ---------------- App ----------------
export default function FrenchB2AppV2() {
  const [state, setState] = usePersistentState();
  const [notes, setNotes] = useState("");

  const weeklyMinutesGoal = state.profile.weeklyHoursGoal * 60;

  // Derived: daily sums
  const dailyMap = useMemo(() => {
    const m = {};
    for (const s of state.studyLog) {
      m[s.date] = (m[s.date] || 0) + (s.minutes || 0);
    }
    return m;
  }, [state.studyLog]);

  // Last 28 days sparkline data
  const sparkData = useMemo(() => {
    const out = [];
    const end = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      out.push(dailyMap[d.toISOString().slice(0, 10)] || 0);
    }
    return out;
  }, [dailyMap]);

  // Activity breakdown (last 7 days)
  const activityBreakdown = useMemo(() => {
    const counts = {};
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    for (const s of state.studyLog) {
      const d = new Date(s.date);
      if (d >= start && d <= end) {
        counts[s.activity] = (counts[s.activity] || 0) + s.minutes;
      }
    }
    const labels = ["Speaking", "Listening", "Vocab", "Grammar", "Writing", "Reading", "Review"];
    return labels.map((l) => ({ label: l, value: counts[l] || 0 }));
  }, [state.studyLog]);

  // Streak
  const streak = useMemo(() => {
    let cur = 0, best = 0;
    const dates = new Set(state.studyLog.map((s) => s.date));
    const now = new Date();
    // best (simple linear scan back up to 365)
    let tmp = 0;
    for (let i = 0; i < 365; i++) {
      const iso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).toISOString().slice(0, 10);
      if (dates.has(iso)) { tmp++; best = Math.max(best, tmp); } else tmp = 0;
    }
    // current
    for (let i = 0; i < 365; i++) {
      const iso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i).toISOString().slice(0, 10);
      if (dates.has(iso)) cur++; else break;
    }
    return { current: cur, best };
  }, [state.studyLog]);

  const addStudy = (minutes, activity) => {
    const entry = { id: uid(), date: todayISO(), minutes, activity, notes: notes || "" };
    console.info("[log] addStudy", entry);
    setState((prev) => ({ ...prev, studyLog: [...prev.studyLog, entry] }));
    setNotes("");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `french_b2_app_v2_${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        console.info("[import] loaded state");
        setState(data);
      } catch (err) {
        alert("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: "agenda", label: "Agenda" },
    { id: "practice", label: "Pratique" },
    { id: "comprehension", label: "Compréhension" },
    { id: "progress", label: "Progrès" },
    { id: "settings", label: "Réglages" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">French B2 — v2</h1>
            <p className="text-sm text-gray-700">
              Objectif: {state.profile.targetLevel} d'ici le {fmtDate(state.profile.targetDate)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={exportJSON}>Exporter</button>
            <label className="px-3 py-2 rounded-xl border bg-white/70 cursor-pointer">
              Importer
              <input type="file" className="hidden" accept="application/json" onChange={(e) => e.target.files[0] && importJSON(e.target.files[0])} />
            </label>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((t) => (
            <TabBtn key={t.id} active={state.ui.tab === t.id} onClick={() => setState((s) => ({ ...s, ui: { ...s.ui, tab: t.id } }))}>{t.label}</TabBtn>
          ))}
        </div>

        {state.ui.tab === "agenda" && <AgendaTab state={state} addStudy={addStudy} notes={notes} setNotes={setNotes} weeklyMinutesGoal={weeklyMinutesGoal} />}
        {state.ui.tab === "practice" && <PracticeTab state={state} addStudy={addStudy} />}
        {state.ui.tab === "comprehension" && <ComprehensionTab state={state} setState={setState} />}
        {state.ui.tab === "progress" && <ProgressTab sparkData={sparkData} activityBreakdown={activityBreakdown} dailyMap={dailyMap} streak={streak} weeklyMinutesGoal={weeklyMinutesGoal} />}
        {state.ui.tab === "settings" && <SettingsTab state={state} setState={setState} />}

        <footer className="text-xs text-gray-700 mt-8">Data saved locally (this device). Use Export/Import to back up.</footer>
      </div>
    </div>
  );
}

// ---------------- Tabs ----------------
function AgendaTab({ state, addStudy, notes, setNotes, weeklyMinutesGoal }) {
  const today = new Date();
  const mapIdx = [1,2,3,4,5,6,0];
  const sc = state.schedule.byDay[ mapIdx[(today.getDay()+6)%7] ];
  const planned = sc?.minutes || 0;

  // Minutes completed this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekISO = weekStart.toISOString().slice(0,10);
  const totalThisWeek = state.studyLog.filter((s) => s.date >= weekISO).reduce((a, s) => a + s.minutes, 0);
  const pct = Math.round(((totalThisWeek || 0) / Math.max(1, weeklyMinutesGoal)) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Objectifs de la semaine" right={<Chip>{pct}% du but</Chip>}>
        <div className="flex items-center gap-4">
          <GoalRing percent={pct} size={92} />
          <div>
            <div className="text-sm">Temps cette semaine</div>
            <div className="text-lg font-semibold">{Math.round(totalThisWeek)} min / {weeklyMinutesGoal} min</div>
            <div className="text-sm text-gray-700">Plan aujourd'hui: <b>{planned}</b> min • <i>{sc?.focus}</i></div>
          </div>
        </div>
      </Card>

      <Card title="Agenda du jour (proposé)">
        <ul className="list-disc ml-5">
          {(/Speaking/i.test(sc?.focus) ? [{ type: "Parler", minutes: 20 }] : []).concat(
            /Vocab/i.test(sc?.focus) ? [{ type: "Vocabulaire SRS", minutes: 15 }] : [],
            /Grammar/i.test(sc?.focus) ? [{ type: "Grammaire", minutes: 15 }] : [],
            /Listening|Shadow/i.test(sc?.focus) ? [{ type: "Écoute/Shadowing", minutes: 15 }] : [],
            /Writing/i.test(sc?.focus) ? [{ type: "Écriture", minutes: 15 }] : [],
          ).map((it, i) => (
            <li key={i}>{it.type} — {it.minutes} min</li>
          ))}
        </ul>
      </Card>

      <Card title="Journal d'étude (ajout rapide)">
        <QuickLog addStudy={addStudy} notes={notes} setNotes={setNotes} />
      </Card>

      <Card title="Historique récent">
        <HistoryList studyLog={state.studyLog} />
      </Card>
    </div>
  );
}

function PracticeTab({ state, addStudy }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Écoute & Shadowing" right={<TranslateButton text={"Bonjour et bienvenue dans cette leçon de français."} />}>
        <ListeningPractice addStudy={addStudy} />
      </Card>

      <Card title="Expression orale (micro)" right={<TranslateButton text={state.speakingPrompts?.[0]?.text || ""} />}>
        <SpeakingPractice prompts={state.speakingPrompts} addStudy={addStudy} />
      </Card>

      <Card title="Vocabulaire (SRS)">
        <VocabPractice />
      </Card>

      <Card title="Écriture guidée">
        <WritingPractice addStudy={addStudy} />
      </Card>
    </div>
  );
}

function ComprehensionTab({ state, setState }) {
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("news"); // news | paste | sample
  const proxy = "https://api.allorigins.win/raw?url="; // public CORS proxy (best-effort)
  const sources = {
    "France 24": "https://www.france24.com/fr/rss",
    "Euronews": "https://www.euronews.com/rss?level=theme&name=news&lang=fr",
    "Le Monde": "https://www.lemonde.fr/rss/en_continu.xml",
  };

  const loadNews = async () => {
    const feedUrl = sources[state.comprehension.source];
    if (!feedUrl) return;
    try {
      setBusy(true);
      console.info("[news] fetching feed", state.comprehension.source);
      const rssTxt = await (await fetch(proxy + encodeURIComponent(feedUrl))).text();
      const xml = new window.DOMParser().parseFromString(rssTxt, "text/xml");
      const item = xml.querySelector("item");
      const title = item?.querySelector("title")?.textContent || "Article";
      const link = item?.querySelector("link")?.textContent || "";
      let text = item?.querySelector("description")?.textContent || "";

      if (link) {
        try {
          console.info("[news] fetching article", link);
          const html = await (await fetch(proxy + encodeURIComponent(link))).text();
          const doc = new window.DOMParser().parseFromString(html, "text/html");
          // naive extraction
          const ps = Array.from(doc.querySelectorAll("p"))
            .map((p) => p.textContent?.trim() || "")
            .filter((t) => t && t.length > 40);
          if (ps.length > 3) text = ps.slice(0, 12).join("\n\n");
        } catch (e) {
          console.warn("[news] article fetch fallback", e);
        }
      }

      setState((prev) => ({ ...prev, comprehension: { ...prev.comprehension, title, text, simplified: "", questions: [] } }));
    } catch (e) {
      console.warn("[news] failed", e);
      alert("News fetch failed. Try Paste mode.");
    } finally {
      setBusy(false);
    }
  };

  const simplify = () => {
    const txt = state.comprehension.text || "";
    if (!txt) return;
    const sentences = txt.split(/(?<=[.!?])\s+/).map((s) => s.trim());
    const out = sentences
      .map((s) => {
        // basic simplification: limit to ~14 words by splitting
        const words = s.split(/\s+/);
        if (words.length <= 14) return s;
        return words.slice(0, 14).join(" ") + " …";
      })
      .join("\n");
    setState((p) => ({ ...p, comprehension: { ...p.comprehension, simplified: out } }));
  };

  const listen = () => {
    const txt = state.comprehension.simplified || state.comprehension.text || "";
    if (!txt) return;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "fr-FR";
    window.speechSynthesis?.speak(u);
  };

  const translate = () => {
    const txt = state.comprehension.simplified || state.comprehension.text || "";
    if (!txt) return;
    const btn = document.createElement("button"); // no-op, satisfy linter for popup
    const open = () => {
      const popup = window.open("", "translationPopup", "width=560,height=420,scrollbars=yes");
      if (!popup) return alert("Please allow popups.");
      popup.document.write(`<!doctype html><html><head><title>Translation</title></head><body style="font-family:system-ui;padding:12px;line-height:1.5"><h3>French</h3><pre style="white-space:pre-wrap">${txt}</pre></body></html>`);
    };
    // quick fetch; show FR first then fetch EN and replace
    open();
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt)}&langpair=fr|en`).then(r=>r.json()).then((data)=>{
      const en = data?.responseData?.translatedText || "(no translation)";
      const popup = window.open("", "translationPopup");
      if (!popup) return;
      popup.document.body.innerHTML += `<h3>English</h3><pre style="white-space:pre-wrap">${en}</pre>`;
    }).catch((e)=>console.warn("[translate] failed", e));
  };

  const makeQuestions = () => {
    const txt = state.comprehension.text || "";
    if (!txt) return;
    const sentences = txt.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length > 6);
    const chosen = sentences.slice(0, 4);
    const qs = chosen.map((s) => {
      const words = s.split(/\s+/);
      const idx = Math.max(0, Math.min(words.length - 1, Math.floor(words.length / 2)));
      const answer = words[idx].replace(/[.,;:!?]/g, "");
      words[idx] = "_____";
      return { id: uid(), sentence: words.join(" "), answer, blank: "_____" };
    });
    setState((p) => ({ ...p, comprehension: { ...p.comprehension, questions: qs } }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Texte (actualité, collage ou échantillon)" right={<Chip>{state.comprehension.source}</Chip>}>
          <div className="flex flex-wrap gap-2 mb-2">
            <select className="border rounded-xl px-3 py-2 bg-white/70" value={state.comprehension.source} onChange={(e)=>setState((p)=>({...p, comprehension:{...p.comprehension, source:e.target.value}}))}>
              {Object.keys(sources).map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={loadNews} disabled={busy}>{busy?"…":"Charger"}</button>
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={simplify}>Simplifier</button>
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={listen}>Écouter</button>
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={translate}>Traduire</button>
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={makeQuestions}>Questions</button>
          </div>
          <input className="border rounded-xl px-3 py-2 w-full mb-2 bg-white/70" placeholder="Coller un texte ici (optionnel)" value={state.comprehension.text} onChange={(e)=>setState((p)=>({...p, comprehension:{...p.comprehension, text:e.target.value}}))} />
          <div className="text-sm text-gray-700 mb-1">{state.comprehension.title}</div>
          <div className="prose max-w-none whitespace-pre-wrap text-sm bg-white/60 p-3 rounded-xl border min-h-[160px]">
            {state.comprehension.simplified || state.comprehension.text || "(Aucun texte pour le moment)"}
          </div>
        </Card>

        <Card title="Questions rapides (cloze)">
          {state.comprehension.questions.length === 0 ? (
            <div className="text-sm text-gray-700">Clique sur «Questions» pour générer 3–4 phrases avec un mot manquant.</div>
          ) : (
            <div className="space-y-3">
              {state.comprehension.questions.map((q) => (
                <QuestionRow key={q.id} q={q} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="Conseils">
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Si le micro ne marche pas, utilise HTTPS (ex: Netlify, Vercel) et autorise l'accès.</li>
            <li>Traduction: popup — autorise les fenêtres pop‑up si bloquées.</li>
            <li>Colle n'importe quel texte français pour faire un exercice personnalisé.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ProgressTab({ sparkData, activityBreakdown, dailyMap, streak, weeklyMinutesGoal }) {
  // Heatmap values (last 8 weeks)
  const heatValues = dailyMap;
  const totalMinutes = Object.values(dailyMap).reduce((a, v) => a + v, 0);
  const hours = (totalMinutes / 60).toFixed(1);

  // Weekly completion (current week)
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekISO = weekStart.toISOString().slice(0,10);
  const thisWeek = Object.entries(dailyMap).filter(([d]) => d >= weekISO).reduce((a, [,v]) => a + v, 0);
  const weeklyPct = Math.round(((thisWeek || 0) / Math.max(1, weeklyMinutesGoal)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Vue d'ensemble">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Heures totales" value={hours} suffix="h" />
          <Stat label="Chaîne" value={streak.current} suffix="jours" />
          <Stat label="Meilleure chaîne" value={streak.best} suffix="jours" />
        </div>
      </Card>

      <Card title="But hebdo">
        <div className="flex items-center gap-4">
          <GoalRing percent={weeklyPct} size={100} />
          <div>
            <div className="text-lg font-semibold">{Math.round(thisWeek)} / {weeklyMinutesGoal} min</div>
            <div className="text-sm text-gray-700">Complète ton plan de la semaine pour rester sur la bonne voie.</div>
          </div>
        </div>
      </Card>

      <Card title="Tendance 4 semaines">
        <Sparkline data={sparkData} />
      </Card>

      <Card title="Répartition (7 jours)">
        <Bars items={activityBreakdown} />
      </Card>

      <Card title="Assiduité (8 semaines)">
        <Heatmap values={heatValues} />
      </Card>
    </div>
  );
}

function SettingsTab({ state, setState }) {
  const [name, setName] = useState(state.profile.name || "");
  const [weekly, setWeekly] = useState(state.profile.weeklyHoursGoal);
  const [target, setTarget] = useState(state.profile.targetDate.slice(0,10));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Profil & Objectifs">
        <div className="grid gap-2">
          <label className="text-sm">Nom (optionnel)</label>
          <input className="border rounded-xl px-3 py-2 bg-white/70" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Prénom" />
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="text-sm">Heures par semaine</label>
              <input type="number" min={1} max={30} className="border rounded-xl px-3 py-2 w-full bg-white/70" value={weekly} onChange={(e)=>setWeekly(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Date objectif (B2)</label>
              <input type="date" className="border rounded-xl px-3 py-2 w-full bg-white/70" value={target} onChange={(e)=>setTarget(e.target.value)} />
            </div>
          </div>
          <div className="mt-2">
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>setState((p)=>({...p, profile:{...p.profile, name, weeklyHoursGoal: clamp(weekly,1,30), targetDate: new Date(target).toISOString() }}))}>Sauvegarder</button>
          </div>
        </div>
      </Card>

      <Card title="Planning hebdomadaire">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { i:1, label:"Lun" },{ i:2, label:"Mar" },{ i:3, label:"Mer" },{ i:4, label:"Jeu" },{ i:5, label:"Ven" },{ i:6, label:"Sam" },{ i:0, label:"Dim" },
          ].map((d) => {
            const row = state.schedule.byDay[d.i] || { minutes: 0, focus: "" };
            return (
              <div key={d.i} className="border rounded-2xl p-3 bg-white/70">
                <div className="font-medium mb-1">{d.label}</div>
                <div className="flex gap-2 items-center mb-2">
                  <input type="number" min={0} max={240} value={row.minutes} onChange={(e)=>setState((p)=>({...p, schedule:{...p.schedule, byDay:{...p.schedule.byDay, [d.i]:{ minutes:Number(e.target.value), focus: row.focus }}}}))} className="border rounded-xl px-2 py-1 w-24 bg-white" />
                  <span className="text-sm text-gray-700">minutes</span>
                </div>
                <input value={row.focus} onChange={(e)=>setState((p)=>({...p, schedule:{...p.schedule, byDay:{...p.schedule.byDay, [d.i]:{ minutes: row.minutes, focus: e.target.value }}}}))} className="border rounded-xl px-2 py-1 w-full bg-white" placeholder="Focus (ex: Speaking + Vocab)" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ---------------- Practice Bits ----------------
function ListeningPractice({ addStudy }) {
  const samples = [
    "Bonjour et bienvenue dans cette leçon de français.",
    "Aujourd'hui, nous allons parler de tes objectifs d'apprentissage.",
    "Répète après moi: Je voudrais atteindre le niveau B2 cette année.",
  ];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="p-3 border rounded-2xl bg-white/60 mb-3">
        <div className="text-sm text-gray-600">Extrait</div>
        <div className="text-lg">{samples[i]}</div>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>{ const u = new SpeechSynthesisUtterance(samples[i]); u.lang = 'fr-FR'; window.speechSynthesis?.speak(u); }}>Écouter</button>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>setI((n)=>(n+1)%samples.length)}>Suivant</button>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>addStudy(10, "Listening")}>
          +10 min
        </button>
        <TranslateButton text={samples[i]} />
      </div>
    </div>
  );
}

function SpeakingPractice({ prompts, addStudy }) {
  const [idx, setIdx] = useState(0);
  const [heard, setHeard] = useState("");
  const { supported, secure, listening, error, start, stop } = useSpeechRecognition({ lang: "fr-FR", onResult: setHeard });
  const p = prompts[idx % prompts.length];
  const score = useMemo(() => similarity(p?.text, heard), [p, heard]);

  return (
    <div>
      <div className="p-3 border rounded-2xl bg-white/60 mb-3">
        <div className="text-sm text-gray-600">Sujet</div>
        <div className="font-semibold">{p.topic}</div>
        <div className="mt-1">{p.text}</div>
      </div>

      <div className="flex gap-2 flex-wrap items-center mb-2">
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>{ const u = new SpeechSynthesisUtterance(p.text); u.lang='fr-FR'; window.speechSynthesis?.speak(u); }}>Écouter le sujet</button>
        {!supported && <span className="text-sm text-red-600">ASR non supporté (Chrome/Edge Android/desktop conseillé).</span>}
        {supported && !secure && <span className="text-sm text-orange-600">Le micro requiert HTTPS (déploie sur Netlify/Vercel).</span>}
        {supported && secure && (
          listening ? (
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={stop}>Arrêter</button>
          ) : (
            <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={start}>Parler</button>
          )
        )}
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>setIdx((n)=>(n+1)%prompts.length)}>Nouveau sujet</button>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>addStudy(10, "Speaking")}>+10 min</button>
        <TranslateButton text={p.text} />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {{
            secure_context_required: "Le micro requiert HTTPS (ou localhost).",
            permission_denied: "Autorise l’accès au micro dans les réglages du site.",
            no_microphone: "Aucun micro détecté — vérifie tes entrées audio.",
            start_failed: "Échec du démarrage de la reconnaissance.",
            mic_error: "Erreur du micro.",
          }[error] || `Erreur micro: ${error}`}
        </div>

      <div className="p-3 border rounded-2xl bg-white/60">
        <div className="text-sm text-gray-600 mb-1">Transcription entendue</div>
        <div className="min-h-10">{heard || <span className="text-gray-400">(Ton texte apparaîtra ici)</span>}</div>
        <div className="text-sm text-gray-700 mt-1">Similarité rapide: <b>{Math.round((score||0)*100)}%</b> (indicatif)</div>
      </div>
    </div>
  );
}

function VocabPractice() {
  const [dummy] = useState(0); // placeholder — hook up your SRS deck if desired
  return (
    <div className="text-sm text-gray-700">Ajoute ici ton système de cartes si tu veux étendre cette section (SRS complet déjà présent dans la v1).</div>
  );
}

function WritingPractice({ addStudy }) {
  const prompts = [
    { title: "Journal court", targetWords: 100, prompt: "Raconte ta matinée d'aujourd'hui en 6-8 phrases." },
    { title: "Email formel", targetWords: 140, prompt: "Demande des informations sur un cours de français (dates, prix, niveau)." },
    { title: "Opinion", targetWords: 160, prompt: "Faut-il limiter l'usage du smartphone dans les écoles? Donne ton avis." },
  ];
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const p = prompts[i % prompts.length];
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <div className="mb-2"><b>{p.title}</b> — Objectif: {p.targetWords} mots</div>
      <div className="text-sm text-gray-600 mb-2">{p.prompt}</div>
      <textarea className="border rounded-2xl px-3 py-2 w-full min-h-[160px] bg-white/60" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Écris ici..." />
      <div className="flex gap-2 items-center mt-2 flex-wrap">
        <Chip>{words} mots</Chip>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>setI(i+1)}>Nouveau sujet</button>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>addStudy(15, "Writing")}>+15 min</button>
        <button className="px-3 py-2 rounded-xl border bg-white/70" onClick={()=>{ const u = new SpeechSynthesisUtterance(text || ""); u.lang='fr-FR'; window.speechSynthesis?.speak(u); }}>Écouter ton texte</button>
        <TranslateButton text={p.prompt} />
      </div>
    </div>
  );
}

function QuestionRow({ q }) {
  const [ans, setAns] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = ans.trim().toLowerCase() === q.answer.trim().toLowerCase();
  return (
    <div className="border rounded-xl p-2 bg-white/60">
      <div className="mb-1 text-sm">{q.sentence}</div>
      <div className="flex gap-2 items-center flex-wrap">
        <input className="border rounded-xl px-2 py-1 bg-white" placeholder="Mot manquant" value={ans} onChange={(e)=>{ setAns(e.target.value); setChecked(false); }} />
        <button className="px-3 py-1.5 rounded-xl border bg-white/70" onClick={()=>setChecked(true)}>Vérifier</button>
        {checked && (
          <span className={`text-sm ${ok?"text-green-700":"text-red-700"}`}>{ok?"Correct !":`Réponse: ${q.answer}`}</span>
        )}
      </div>
    </div>
  );
}

function QuickLog({ addStudy, notes, setNotes }) {
  const [minutes, setMinutes] = useState(20);
  const [activity, setActivity] = useState("Speaking");
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
