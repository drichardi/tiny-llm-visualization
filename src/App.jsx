import { useState, useEffect } from 'react';

const sentence = ["The", "cat", "sits", "on", "the"];

const rawEmbeddings = {
  "The":  [0.8, -0.2, 0.1],
  "cat":  [0.9,  0.4, -0.5],
  "sits": [-0.1, 0.8,  0.2],
  "on":   [0.2, -0.1,  0.6],
  "the":  [0.8, -0.2,  0.1],
};

const contextualEmbedding = [0.7, 0.3, 0.4];

const weightMatrix = [
  [ 0.5, -0.2,  0.1],
  [ 0.1,  0.8, -0.3],
  [-0.4,  0.1,  0.9],
];

const biasVector = [0.1, -0.1, 0.2];
const logits = [0.3, 0.6, 0.8];

const probabilities = [
  { word: "mat",   p: 0.82 },
  { word: "floor", p: 0.13 },
  { word: "dog",   p: 0.05 },
];

const phases = [
  {
    title: "1. Tokenization & Input",
    desc: "The LLM reads text and breaks it into chunks called tokens. Here, we want to predict the word that comes after 'the'.",
  },
  {
    title: "2. Embeddings",
    desc: "Each word is converted into an 'Embedding'—a list of numbers representing its core meaning. Words with similar meanings have similar numbers.",
  },
  {
    title: "3. Self-Attention (Context)",
    desc: "The model doesn't look at 'the' in isolation. It uses Attention to pull information from previous words (context), updating 'the' to mean 'the [specifically referring to the object a cat sits on]'.",
  },
  {
    title: "4. Weights (Linear Layer)",
    desc: "The new context-aware numbers are multiplied by a Weight Matrix (W). This is the 'brain' of the network, transforming the meaning into a prediction.",
  },
  {
    title: "5. Bias",
    desc: "A Bias vector (b) is added. This acts as an offset or baseline adjustment. The formula is now complete: y = (x * W) + b.",
  },
  {
    title: "6. Output & Probabilities",
    desc: "The final numbers (logits) are converted into percentages using a Softmax function. The model predicts 'mat' as the most likely next word!",
  },
];

function Tensor({ data, label, highlight = false }) {
  const isMatrix = Array.isArray(data[0]);
  const fmt = (n) => n.toFixed(1);
  const border = highlight ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-700';
  const bg = highlight ? 'bg-cyan-900/20' : 'bg-slate-800/50';
  const numColor = highlight ? 'text-cyan-300' : 'text-slate-300';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-xs text-slate-400 mb-1">{label}</span>
      <div className={`rounded-lg border p-2 font-mono text-xs transition-all duration-500 ${border} ${bg}`}>
        {isMatrix ? (
          <div className="flex flex-col gap-1">
            {data.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((val, j) => (
                  <span key={j} className={`w-10 text-center ${numColor}`}>{fmt(val)}</span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {data.map((val, i) => (
              <span key={i} className={`block text-center ${numColor}`}>{fmt(val)}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhase((p) => (p < 5 ? p + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 selection:bg-cyan-900">

      {/* HEADER & CONTROLS */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Anatomy of an LLM
          </h1>
          <p className="text-slate-400 mt-1">A tiny scale visualization of y = Wx + b and Attention</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-full border border-slate-700">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex gap-2 pr-2">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => { setPhase(step); setIsPlaying(false); }}
                className={`w-3 h-3 rounded-full transition-all ${
                  phase === step ? 'bg-cyan-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN: EXPLANATION PANEL */}
        <div className="col-span-1 lg:col-span-1">
          <div className="sticky top-12 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
            <h2 className="text-xl font-bold text-white mb-4">{phases[phase].title}</h2>
            <p className="text-slate-300 leading-relaxed min-h-[120px]">{phases[phase].desc}</p>
            <div className="mt-8 flex justify-between items-center text-sm font-mono text-slate-500 border-t border-slate-800 pt-6">
              <span>Step {phase + 1} of 6</span>
              <button
                onClick={() => setPhase((p) => (p < 5 ? p + 1 : 0))}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {phase === 5 ? 'Restart ↺' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZATION CANVAS */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900/30 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-start min-h-[600px] relative overflow-hidden">

          {/* STAGE 1: TOKENS & EMBEDDINGS (Phases 0-2) */}
          <div className={`w-full transition-all duration-1000 ${phase <= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 absolute'}`}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              {sentence.map((word, i) => {
                const isTarget = i === sentence.length - 1;
                return (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-lg font-mono text-lg transition-all duration-500 ${
                        isTarget
                          ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-300'
                      }`}
                    >
                      &ldquo;{word}&rdquo;
                    </div>

                    <div
                      className={`h-8 w-px bg-gradient-to-b from-slate-600 to-transparent transition-opacity duration-500 ${
                        phase >= 1 ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    <div
                      className={`transition-all duration-700 ${
                        phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                      } ${phase >= 3 && !isTarget ? 'opacity-20' : ''}`}
                    >
                      <Tensor
                        data={phase >= 2 && isTarget ? contextualEmbedding : rawEmbeddings[word]}
                        label={isTarget && phase >= 2 ? 'Contextualized' : 'Embedding'}
                        highlight={isTarget && phase === 1}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ATTENTION LINES OVERLAY (Phase 2) */}
          {phase === 2 && (
            <div className="absolute top-32 left-0 w-full h-40 pointer-events-none flex justify-center items-center z-0">
              <svg className="w-full h-full opacity-40 animate-pulse text-purple-400">
                <path d="M 200,80 Q 400,120 650,80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 350,80 Q 500,100 650,80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 500,80 Q 600,90 650,80"  fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          )}

          {/* STAGE 2: WEIGHTS, BIAS, MATH (Phases 3-4) */}
          <div
            className={`w-full transition-all duration-1000 flex flex-col items-center mt-4 ${
              phase >= 3 && phase <= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute pointer-events-none'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
              <Tensor data={contextualEmbedding} label="Input (x)" highlight={phase >= 3} />

              <span className="text-2xl font-bold text-slate-500 animate-pulse">×</span>

              <Tensor data={weightMatrix} label="Weights (W)" highlight={phase >= 3} />

              <span
                className={`text-2xl font-bold transition-opacity duration-500 ${
                  phase >= 4 ? 'text-slate-500 animate-pulse opacity-100' : 'opacity-0'
                }`}
              >
                +
              </span>

              <div className={`transition-all duration-700 ${phase >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <Tensor data={biasVector} label="Bias (b)" highlight={phase >= 4} />
              </div>
            </div>
          </div>

          {/* STAGE 3: OUTPUT PROBABILITIES (Phase 5) */}
          <div
            className={`w-full mt-12 transition-all duration-1000 ${
              phase === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Math result row */}
              <div className="flex flex-wrap items-center justify-center gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-700 mb-8">
                <Tensor data={contextualEmbedding} label="Input (x)" highlight />
                <span className="text-2xl font-bold text-slate-500">×</span>
                <Tensor data={weightMatrix} label="Weights (W)" highlight />
                <span className="text-2xl font-bold text-slate-500">+</span>
                <Tensor data={biasVector} label="Bias (b)" highlight />
                <span className="text-2xl font-bold text-cyan-400">=</span>
                <Tensor data={logits} label="Logits (y)" highlight />
              </div>

              <div className="h-8 w-px bg-gradient-to-b from-slate-600 to-transparent mb-4" />
              <span className="font-mono text-xs text-purple-400 mb-4 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                Softmax Function
              </span>

              <div className="flex gap-4 md:gap-8">
                {probabilities.map((prob, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center p-4 rounded-xl border ${
                      i === 0
                        ? 'bg-cyan-900/40 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-110'
                        : 'bg-slate-800/50 border-slate-700 scale-95 opacity-70'
                    }`}
                  >
                    <span className="text-2xl mb-2">{i === 0 ? '🐈' : i === 1 ? '🪵' : '🐕'}</span>
                    <span className="font-mono text-lg font-bold text-white">&ldquo;{prob.word}&rdquo;</span>
                    <span className={`font-mono mt-1 ${i === 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {(prob.p * 100).toFixed(0)}%
                    </span>
                    <div className="w-20 h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full ${i === 0 ? 'bg-cyan-400' : 'bg-slate-500'}`}
                        style={{ width: `${prob.p * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
