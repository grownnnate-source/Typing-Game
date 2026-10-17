import React from "react";

const ConfigToolbar = ({
  mode,
  setMode,
  timeOption,
  setTimeOption,
  wordOption,
  setWordOption,
  disabled
}) => {
  return (
    <div className="config-bar" style={{ opacity: disabled ? 0.3 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      {/* Mode Selector */}
      <div className="config-group">
        <button
          className={`config-btn ${mode === "time" ? "active" : ""}`}
          onClick={() => setMode("time")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          time
        </button>
        <button
          className={`config-btn ${mode === "words" ? "active" : ""}`}
          onClick={() => setMode("words")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10" />
          </svg>
          words
        </button>
      </div>

      <div className="config-divider"></div>

      {/* Sub-options for active mode */}
      <div className="config-group">
        {mode === "time" ? (
          <>
            {[15, 30, 60, 120].map((t) => (
              <button
                key={t}
                className={`config-btn ${timeOption === t ? "active" : ""}`}
                onClick={() => setTimeOption(t)}
              >
                {t}
              </button>
            ))}
          </>
        ) : (
          <>
            {[10, 25, 50, 100].map((w) => (
              <button
                key={w}
                className={`config-btn ${wordOption === w ? "active" : ""}`}
                onClick={() => setWordOption(w)}
              >
                {w}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigToolbar;
