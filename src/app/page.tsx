"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cases, Choice, formatRupiah, GameCase, INITIAL_BUDGET, suppliers } from "@/lib/game-data";

type Screen = "landing" | "howto" | "game" | "result";
type Transaction = { id: string; label: string; amount: number; caseId: number };
type Answer = { caseId: number; choiceId: string; correct?: boolean; style?: string; label: string };
type SaveState = { screen: Screen; current: number; balance: number; score: number; answers: Answer[]; transactions: Transaction[] };

const SAVE_KEY = "crumberra-budget-quest-v1";

function Cookie({ className = "", small = false }: { className?: string; small?: boolean }) {
  return <span className={`cookie ${small ? "cookie--small" : ""} ${className}`} aria-hidden="true"><i/><i/><i/><i/><i/></span>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="logo" aria-label="Crumberra"><Cookie small/><span>Crumberra</span>{!compact && <b>Budget Quest</b>}</div>;
}

function SoftButton({ children, onClick, variant = "primary", disabled = false, className = "", type = "button", ariaLabel }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; disabled?: boolean; className?: string; type?: "button" | "submit"; ariaLabel?: string;
}) {
  return <button type={type} aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={`soft-button soft-button--${variant} ${className}`}>{children}</button>;
}

function BackgroundCrumbs() {
  const crumbs = Array.from({ length: 17 });
  return <div className="crumb-field" aria-hidden="true">{crumbs.map((_, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}/>)}</div>;
}

function BudgetJar({ balance, animateSpend = false, compact = false }: { balance: number; animateSpend?: boolean; compact?: boolean }) {
  const ratio = Math.max(0, balance / INITIAL_BUDGET);
  const count = Math.max(0, Math.round(ratio * (compact ? 8 : 14)));
  return (
    <div className={`budget-jar-wrap ${compact ? "budget-jar-wrap--compact" : ""}`}>
      <div className="jar-cap"/>
      <motion.div className={`budget-jar ${balance < 700_000 ? "budget-jar--low" : ""}`} animate={balance < 700_000 ? { x: [0,-2,2,-2,0] } : {}} transition={{ repeat: Infinity, repeatDelay: 3 }}>
        <div className="jar-shine"/>
        <div className="jar-cookies">
          <AnimatePresence>
            {Array.from({ length: count }).map((_, i) => <motion.span key={`${count}-${i}`} initial={{ y: -70, rotate: 0, opacity: 0 }} animate={{ y: 0, rotate: i % 2 ? 16 : -12, opacity: 1 }} exit={{ y: -90, x: 45, rotate: 90, opacity: 0 }} transition={{ delay: Math.min(i * .035, .35), type: "spring" }}><Cookie small/></motion.span>)}
          </AnimatePresence>
        </div>
        {animateSpend && <motion.span className="spend-puff" initial={{ scale: .3, opacity: 1 }} animate={{ scale: 1.7, opacity: 0 }}>−</motion.span>}
      </motion.div>
      {!compact && <div className="jar-label"><span>Budget Cookie Jar</span><strong>{formatRupiah(balance)}</strong><small>{Math.round(ratio * 100)}% modal tersisa</small></div>}
    </div>
  );
}

function ProgressTray({ current }: { current: number }) {
  return <div className="progress-tray" aria-label={`Progress ${current} dari ${cases.length}`}>
    {cases.map((item, index) => <span key={item.id} className={index < current ? "done" : index === current ? "active" : ""}><Cookie small/></span>)}
  </div>;
}

function Landing({ onStart, onHowTo, hasSave, onContinue }: { onStart: () => void; onHowTo: () => void; hasSave: boolean; onContinue: () => void }) {
  const reduceMotion = useReducedMotion();
  return <main className="landing page-shell">
    <BackgroundCrumbs/>
    <header className="landing-nav"><Logo compact/><span className="sound-note">10 tantangan bisnis • 12–15 menit</span></header>
    <section className="hero-grid">
      <motion.div className="hero-copy" initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }}>
        <span className="eyebrow"><i/> Game edukasi bisnis cookies</span>
        <h1>Kelola adonan.<br/><em>Jaga modal.</em><br/>Panggang untung.</h1>
        <p>Ambil alih toko Crumberra, pecahkan business case, dan buktikan keputusanmu sematang cookies baru keluar oven.</p>
        <div className="hero-actions">
          <SoftButton onClick={onStart}>Mulai Jadi Manager <span>→</span></SoftButton>
          <SoftButton onClick={onHowTo} variant="secondary">Cara Bermain</SoftButton>
        </div>
        {hasSave && <button className="continue-link" onClick={onContinue}>↻ Lanjutkan quest yang tersimpan</button>}
      </motion.div>
      <motion.div className="hero-shop" initial={{ opacity: 0, scale: .9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", delay: .12 }}>
        <span className="shop-sign">CRUMBERRA</span>
        <div className="awning"><i/><i/><i/><i/><i/></div>
        <div className="shop-window">
          <div className="shelf"><Cookie/><Cookie small/><Cookie/></div>
          <BudgetJar balance={INITIAL_BUDGET}/>
        </div>
        <div className="shop-base"><span>Fresh decisions, baked daily</span></div>
        {!reduceMotion && Array.from({ length: 5 }).map((_, i) => <motion.span className="falling-cookie" key={i} initial={{ y: -160, x: i * 24 - 40, rotate: 0, opacity: 0 }} animate={{ y: 145, x: i * 9 - 18, rotate: 180 + i * 32, opacity: [0,1,1,0] }} transition={{ delay: .3 + i * .18, duration: 1.15 }}><Cookie small/></motion.span>)}
      </motion.div>
    </section>
    <footer className="landing-footer"><span>🍪 Belajar tanpa terasa sedang ujian</span><span>Progress tersimpan otomatis</span></footer>
  </main>;
}

const steps = [
  { icon: "jar", n: "01", title: "Mulai dengan modal", text: "Kamu memegang Rp3.000.000 di dalam Budget Cookie Jar." },
  { icon: "case", n: "02", title: "Pilih dengan matang", text: "Selesaikan business case dan lihat konsekuensi tiap keputusan." },
  { icon: "event", n: "03", title: "Hadapi kejutan", text: "Event Card bisa mengubah rencana. Jaga pengeluaran tetap terkendali." },
  { icon: "trophy", n: "04", title: "Panggang hasil terbaik", text: "Selesaikan 10 tantangan dan raih gelar manager tertinggi." },
];

function HowTo({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return <main className="howto page-shell"><BackgroundCrumbs/>
    <header className="simple-header"><button onClick={onBack} className="icon-button" aria-label="Kembali">←</button><Logo compact/><span/></header>
    <section className="howto-head"><span className="eyebrow"><i/> Resep bermain</span><h1>Empat langkah menuju<br/><em>cookies yang cuan</em></h1><p>Tujuanmu sederhana: selesaikan semua tantangan tanpa membuat Budget Cookie Jar kosong.</p></section>
    <section className="steps-grid">{steps.map((step, i) => <motion.article key={step.n} className={`step-card step-card--${i + 1}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}>
      <span className="step-number">{step.n}</span><div className={`step-illustration ${step.icon}`}><Cookie/></div><h2>{step.title}</h2><p>{step.text}</p>
    </motion.article>)}</section>
    <aside className="rule-strip"><span>Ingat, Manager!</span><p>Setiap rupiah yang keluar mengurangi isi toples. Pilihan yang lebih mahal dari saldo akan terkunci otomatis.</p><SoftButton onClick={onStart}>Mulai Quest <span>→</span></SoftButton></aside>
  </main>;
}

function SupplierCards({ selected, onSelect, balance }: { selected?: string; onSelect: (choice: Choice) => void; balance: number }) {
  return <div className="supplier-grid">{suppliers.map((supplier) => {
    const choice = cases[5].choices.find((c) => c.id === supplier.id)!;
    const disabled = supplier.price > balance;
    return <button key={supplier.id} disabled={disabled || !!selected} onClick={() => onSelect(choice)} className={`supplier-card ${selected === supplier.id ? "selected" : ""}`}>
      {supplier.recommended && <span className="recommended">Pilihan seimbang</span>}
      <span className="supplier-mark">{supplier.name.slice(-1)}</span><h3>{supplier.name}</h3><strong>{formatRupiah(supplier.price)}</strong>
      <dl><div><dt>Kualitas</dt><dd>{supplier.quality}</dd></div><div><dt>Kapasitas</dt><dd>{supplier.capacity}</dd></div><div><dt>Pengiriman</dt><dd>{supplier.delivery}</dd></div><div><dt>Risiko</dt><dd className={`risk risk--${supplier.risk.toLowerCase()}`}>{supplier.risk}</dd></div></dl>
      <span className="select-supplier">{disabled ? "Saldo tidak cukup" : "Pilih supplier"} →</span>
    </button>;
  })}</div>;
}

function AllocationChoice({ choice, disabled, selected, onClick }: { choice: Choice; disabled: boolean; selected: boolean; onClick: () => void }) {
  const gradient = choice.allocation?.map((part, i, arr) => {
    const before = arr.slice(0, i).reduce((sum, p) => sum + p.value, 0) / INITIAL_BUDGET * 100;
    const after = (before + part.value / INITIAL_BUDGET * 100);
    return `${part.color} ${before}% ${after}%`;
  }).join(", ");
  return <button disabled={disabled} onClick={onClick} className={`allocation-card ${selected ? "selected" : ""}`}><div className="budget-cookie" style={{ background: `conic-gradient(${gradient})` }}><span/></div><div><h3>{choice.label}</h3>{choice.allocation?.map((part) => <p key={part.label}><i style={{ background: part.color }}/><span>{part.label}</span><strong>{formatRupiah(part.value)}</strong></p>)}</div></button>;
}

function CaseVisual({ item }: { item: GameCase }) {
  if (item.visual === "event") return <motion.div className="case-visual event-envelope" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: .6 }}><span>!</span><b>EVENT</b><Cookie small/></motion.div>;
  if (item.visual === "calculator") return <div className="case-visual calculator"><span>3.500</span><i/><i/><i/><i/><i/><i/></div>;
  if (item.visual === "budget") return <div className="case-visual mini-board"><div/><Cookie/><span>3 JT</span></div>;
  if (item.visual === "factory") return <div className="case-visual oven"><div className="oven-top"/><div className="oven-door"><Cookie/></div><i/><i/><i/></div>;
  return <div className="case-visual ingredients"><span className="rolling-pin"/><Cookie/><i/><i/><i/></div>;
}

function Feedback({ item, choice, onNext }: { item: GameCase; choice: Choice; onNext: () => void }) {
  const isManagerial = item.kind === "event";
  const good = choice.correct || choice.recommended;
  return <motion.div className={`feedback ${isManagerial ? "feedback--managerial" : good ? "feedback--good" : "feedback--wrong"}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status">
    <div className="feedback-icon">{isManagerial ? "↗" : good ? "✓" : "↻"}</div>
    <div className="feedback-copy">
      <span>{isManagerial ? choice.style : good ? "Keputusan matang!" : "Oops, adonannya belum pas."}</span>
      {isManagerial && <><h3>{choice.consequence}</h3><div className="tradeoffs"><p><b>+</b> {choice.benefits}</p><p><b>!</b> {choice.risks}</p></div></>}
      <p>{item.explanation}</p>
      {item.kind === "calculation" && <div className="formula"><span>Rp3.500.000</span><i>−</i><span>Rp2.850.000</span><i>=</i><strong>Rp650.000</strong></div>}
    </div>
    <SoftButton onClick={onNext}>{item.id === cases.length ? "Lihat Hasil" : "Lanjutkan Quest"} <span>→</span></SoftButton>
  </motion.div>;
}

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return <div className="transactions"><h3>Jejak pengeluaran</h3>{transactions.length === 0 ? <div className="empty-transactions"><Cookie small/><p>Toples masih utuh.<br/>Belum ada pengeluaran.</p></div> : <ul>{[...transactions].reverse().map((tx) => <li key={tx.id}><span><i>−</i>{tx.label}<small>Case {tx.caseId}</small></span><strong>−{formatRupiah(tx.amount)}</strong></li>)}</ul>}</div>;
}

function Game({ saved, onFinish, onExit }: { saved?: SaveState; onFinish: (state: SaveState) => void; onExit: () => void }) {
  const [current, setCurrent] = useState(saved?.current ?? 0);
  const [balance, setBalance] = useState(saved?.balance ?? INITIAL_BUDGET);
  const [score, setScore] = useState(saved?.score ?? 0);
  const [answers, setAnswers] = useState<Answer[]>(saved?.answers ?? []);
  const [transactions, setTransactions] = useState<Transaction[]>(saved?.transactions ?? []);
  const [selected, setSelected] = useState<Choice | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [spending, setSpending] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const item = cases[current];

  useEffect(() => {
    const save: SaveState = { screen: "game", current, balance, score, answers, transactions };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [current, balance, score, answers, transactions]);

  const ping = (positive = true) => {
    if (!sound || typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = audioRef.current ?? new AudioCtx(); audioRef.current = context;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = positive ? 620 : 210; oscillator.type = positive ? "sine" : "triangle";
    gain.gain.setValueAtTime(.055, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .16);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .16);
  };

  const choose = (choice: Choice) => {
    if (selected || (choice.cost ?? 0) > balance) return;
    setSelected(choice);
    const correct = choice.correct ?? choice.recommended;
    if (correct) setScore((value) => value + 10);
    const answer: Answer = { caseId: item.id, choiceId: choice.id, correct, style: choice.style, label: choice.label };
    setAnswers((value) => [...value.filter((a) => a.caseId !== item.id), answer]);
    if (choice.cost) {
      setBalance((value) => value - choice.cost!);
      setTransactions((value) => [...value, { id: `${item.id}-${choice.id}`, label: choice.label, amount: choice.cost!, caseId: item.id }]);
      setSpending(true); window.setTimeout(() => setSpending(false), 800);
    }
    ping(Boolean(correct) || item.kind === "event");
  };

  const next = () => {
    if (current === cases.length - 1) {
      const finalState: SaveState = { screen: "result", current, balance, score, answers, transactions };
      localStorage.setItem(SAVE_KEY, JSON.stringify(finalState)); onFinish(finalState); return;
    }
    setSelected(undefined); setCurrent((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => { localStorage.removeItem(SAVE_KEY); onExit(); };
  const spent = INITIAL_BUDGET - balance;

  return <main className="game-page">
    <header className="game-header"><Logo compact/><div className="desktop-progress"><span>CASE {String(item.id).padStart(2,"0")} / {cases.length}</span><ProgressTray current={current}/></div><div className="header-actions"><button onClick={() => setSound(!sound)} className="icon-button" aria-label={sound ? "Matikan suara" : "Nyalakan suara"}>{sound ? "♫" : "×"}</button><button onClick={() => setRestartOpen(true)} className="text-button">Ulangi</button></div></header>
    <div className="mobile-status"><div><span>Case {item.id}/{cases.length}</span><strong>{formatRupiah(balance)}</strong></div><ProgressTray current={current}/></div>
    <div className="game-layout">
      <section className="case-area">
        <AnimatePresence mode="wait"><motion.article key={item.id} className={`case-card ${selected && !selected.correct && item.kind !== "event" ? "case-card--answered" : ""}`} initial={{ opacity: 0, x: 38, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -38 }} transition={{ duration: .32 }}>
          <div className="case-top"><div><span className={`category category--${item.category.toLowerCase().replace(" ", "-")}`}>{item.category}</span><span className="case-count">Business case {String(item.id).padStart(2,"0")}</span></div><CaseVisual item={item}/></div>
          <h1>{item.title}</h1>{item.narrative && <p className="narrative">{item.narrative}</p>}<h2>{item.question}</h2>
          {item.kind === "supplier" ? <SupplierCards selected={selected?.id} onSelect={choose} balance={balance}/> : item.kind === "allocation" ? <div className="allocation-grid">{item.choices.map((choice) => <AllocationChoice key={choice.id} choice={choice} disabled={!!selected} selected={selected?.id === choice.id} onClick={() => choose(choice)}/>)}</div> : <div className="choice-list">{item.choices.map((choice, index) => {
            const unaffordable = (choice.cost ?? 0) > balance;
            const selectedClass = selected?.id === choice.id ? "selected" : "";
            const resultClass = selected ? choice.correct || choice.recommended ? "correct" : selectedClass ? "wrong" : "" : "";
            return <motion.button whileHover={!selected && !unaffordable ? { y: -3 } : {}} key={choice.id} disabled={!!selected || unaffordable} onClick={() => choose(choice)} className={`choice ${selectedClass} ${resultClass}`}><span className="choice-key">{String.fromCharCode(65 + index)}</span><span className="choice-label">{choice.label}{choice.cost !== undefined && choice.cost > 0 && <small>{formatRupiah(choice.cost)}</small>}</span>{unaffordable ? <span className="lock">Saldo belum cukup</span> : <span className="choice-arrow">→</span>}</motion.button>;
          })}</div>}
          {selected && <Feedback item={item} choice={selected} onNext={next}/>} {!selected && <p className="choice-hint">Pilih satu keputusan untuk membuka penjelasan.</p>}
          {(selected?.correct || selected?.recommended) && <div className="chip-confetti" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <motion.i key={i} initial={{ opacity: 1, x: 0, y: 0 }} animate={{ opacity: 0, x: (i % 2 ? 1 : -1) * (35 + i * 7), y: -30 - (i % 4) * 24, rotate: i * 30 }} transition={{ duration: .8 }}/>)}</div>}
        </motion.article></AnimatePresence>
      </section>
      <aside className="game-sidebar"><BudgetJar balance={balance} animateSpend={spending}/><div className="stats-row"><div><span>Total keluar</span><strong>{formatRupiah(spent)}</strong></div><div><span>Skor matang</span><strong>{score}<small> pts</small></strong></div></div><TransactionList transactions={transactions}/></aside>
    </div>
    <button className="mobile-history-button" onClick={() => setSheetOpen(true)}>Lihat jejak pengeluaran <span>{transactions.length}</span></button>
    <AnimatePresence>{sheetOpen && <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheetOpen(false)}><motion.aside className="bottom-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} onClick={(e) => e.stopPropagation()}><button onClick={() => setSheetOpen(false)} className="sheet-handle" aria-label="Tutup riwayat"/><div className="sheet-budget"><BudgetJar compact balance={balance}/><div><span>Sisa modal</span><strong>{formatRupiah(balance)}</strong></div></div><TransactionList transactions={transactions}/></motion.aside></motion.div>}</AnimatePresence>
    <AnimatePresence>{restartOpen && <div className="modal-backdrop"><motion.div className="confirm-modal" initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Cookie/><h2>Ulang dari adonan awal?</h2><p>Progress, skor, dan isi Budget Cookie Jar saat ini akan dihapus.</p><div><SoftButton onClick={restart}>Ya, mulai lagi</SoftButton><SoftButton onClick={() => setRestartOpen(false)} variant="secondary">Tetap lanjut</SoftButton></div></motion.div></div>}</AnimatePresence>
  </main>;
}

function Result({ state, onRestart }: { state: SaveState; onRestart: () => void }) {
  const [summary, setSummary] = useState(false);
  const correct = state.answers.filter((a) => a.correct).length;
  const graded = cases.filter((c) => c.kind !== "event").length;
  const percentage = Math.round((correct / graded) * 100);
  const title = percentage >= 90 ? "Master Cookie Manager" : percentage >= 70 ? "Smart Dough Strategist" : percentage >= 50 ? "Rising Cookiepreneur" : "Manager in Training";
  const managerial = state.answers.filter((a) => a.style);
  const share = async () => {
    const text = `Aku meraih gelar ${title} di Crumberra: Budget Quest dengan skor ${percentage}% dan saldo ${formatRupiah(state.balance)}!`;
    if (navigator.share) await navigator.share({ title: "Crumberra: Budget Quest", text }); else await navigator.clipboard.writeText(text);
  };
  return <main className="result-page page-shell"><BackgroundCrumbs/><header className="simple-header"><Logo compact/><span/></header>
    <motion.section className="result-hero" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div className="oven-result"><div className="oven-glow"/><div className="oven-rack">{Array.from({ length: 5 }).map((_, i) => <motion.span key={i} initial={{ y: 40, opacity: 0 }} animate={{ y: i % 2 ? -6 : 0, opacity: 1 }} transition={{ delay: .3 + i * .1 }}><Cookie/></motion.span>)}</div></div>
      <span className="eyebrow"><i/> Quest selesai</span><h1>Batch keputusanmu<br/><em>sudah matang!</em></h1><p className="result-title">{title}</p>
      <div className="result-score"><strong>{percentage}</strong><span>%<small>keberhasilan</small></span></div>
    </motion.section>
    <section className="result-stats"><article><span>Saldo akhir</span><strong>{formatRupiah(state.balance)}</strong><small>dari modal Rp3.000.000</small></article><article><span>Total pengeluaran</span><strong>{formatRupiah(INITIAL_BUDGET - state.balance)}</strong><small>{state.transactions.length} transaksi</small></article><article><span>Proyeksi keuntungan</span><strong>{formatRupiah(350_000)}</strong><small>setelah kenaikan biaya</small></article><article><span>Jawaban matang</span><strong>{correct} / {graded}</strong><small>case pengetahuan</small></article></section>
    {managerial.length > 0 && <section className="manager-style"><div><span>Gaya manajermu</span><h2>{managerial[0].style}</h2></div><p>Kamu memilih “{managerial[0].label}”. Keputusanmu menunjukkan cara menyeimbangkan peluang dengan risiko saat situasi berubah.</p></section>}
    <div className="result-actions"><SoftButton onClick={onRestart}>Main Lagi</SoftButton><SoftButton onClick={() => setSummary(!summary)} variant="secondary">{summary ? "Tutup Ringkasan" : "Lihat Ringkasan Keputusan"}</SoftButton><SoftButton onClick={share} variant="ghost">Bagikan Hasil ↗</SoftButton></div>
    <AnimatePresence>{summary && <motion.section className="summary-list" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><h2>Jejak keputusanmu</h2>{state.answers.map((answer) => <article key={answer.caseId}><span>{String(answer.caseId).padStart(2,"0")}</span><div><small>{cases[answer.caseId - 1].category}</small><strong>{answer.label}</strong></div><i className={answer.correct ? "good" : answer.style ? "neutral" : "retry"}>{answer.correct ? "Matang" : answer.style ?? "Pelajari lagi"}</i></article>)}</motion.section>}</AnimatePresence>
  </main>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<SaveState | undefined>();
  useEffect(() => { try { const raw = localStorage.getItem(SAVE_KEY); if (raw) setSaved(JSON.parse(raw)); } catch {} setHydrated(true); }, []);
  const startFresh = () => { localStorage.removeItem(SAVE_KEY); setSaved(undefined); setScreen("game"); };
  const finish = (state: SaveState) => { setSaved(state); setScreen("result"); window.scrollTo({ top: 0 }); };
  const restart = () => { localStorage.removeItem(SAVE_KEY); setSaved(undefined); setScreen("landing"); window.scrollTo({ top: 0 }); };
  if (!hydrated) return <main className="loading-screen"><div><Cookie/><span>Menyiapkan adonan quest…</span></div></main>;
  return <AnimatePresence mode="wait">{screen === "landing" && <motion.div key="landing" exit={{ opacity: 0 }}><Landing onStart={startFresh} onHowTo={() => setScreen("howto")} hasSave={!!saved} onContinue={() => setScreen(saved?.screen === "result" ? "result" : "game")}/></motion.div>}{screen === "howto" && <motion.div key="howto" exit={{ opacity: 0 }}><HowTo onStart={startFresh} onBack={() => setScreen("landing")}/></motion.div>}{screen === "game" && <motion.div key="game" exit={{ opacity: 0 }}><Game saved={saved?.screen === "game" ? saved : undefined} onFinish={finish} onExit={restart}/></motion.div>}{screen === "result" && saved && <motion.div key="result" exit={{ opacity: 0 }}><Result state={saved} onRestart={restart}/></motion.div>}</AnimatePresence>;
}
