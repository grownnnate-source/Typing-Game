import React from "react";

const ResultsCard = ({ stats, onRestart }) => {
  const { wpm, accuracy, rawWpm, correctChars, incorrectChars, totalChars, timeElapsed, testType } = stats;

  return (
    <div className="results-card">
      {/* Primary Highlights */}
      <div className="results-primary">
        <div className="stat-box">
          <span className="stat-label">wpm</span>
          <span className="stat-value-large">{wpm}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">acc</span>
          <span className="stat-value-large">{accuracy}%</span>
        </div>
      </div>

      {/* Secondary Detailed Breakdown */}
      <div className="results-secondary">
        <div className="stat-sub-box">
          <span className="stat-sub-label">test type</span>
          <span className="stat-sub-value">{testType}</span>
        </div>

        <div className="stat-sub-box">
          <span className="stat-sub-label">raw</span>
          <span className="stat-sub-value">{rawWpm}</span>
        </div>

        <div className="stat-sub-box">
          <span className="stat-sub-label">characters</span>
          <span className="stat-sub-value" title="correct / incorrect / total">
            <span style={{ color: "var(--text-color)" }}>{correctChars}</span>/
            <span style={{ color: "var(--error-color)" }}>{incorrectChars}</span>/
            <span style={{ color: "var(--sub-color)" }}>{totalChars}</span>
          </span>
        </div>

        <div className="stat-sub-box">
          <span className="stat-sub-label">time</span>
          <span className="stat-sub-value">{timeElapsed}s</span>
        </div>
      </div>

      {/* Action / Next Test */}
      <div className="restart-bar">
        <button className="restart-btn" onClick={onRestart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          next test
        </button>
      </div>
    </div>
  );
};

export default ResultsCard;
