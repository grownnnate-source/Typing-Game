import React, { useRef, useEffect, useState } from "react";

const TypingArea = ({
  paragraph,
  userInput,
  onUserType,
  onRestart,
  gameStatus
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  // Auto focus input on mount and when test restarts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [paragraph, gameStatus]);

  // Global keydown to catch any keystroke and focus input (unless modifier key)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't intercept ctrl/meta combinations or tab/esc
      if (e.key === "Tab") {
        e.preventDefault();
        onRestart();
        return;
      }
      if (e.key === "Escape") {
        onRestart();
        return;
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onRestart]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Split paragraph into words to preserve word boundaries
  const words = paragraph ? paragraph.split(" ") : [];

  // Track global index across words
  let charCounter = 0;

  return (
    <div
      className="test-section"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Hidden input to capture keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        value={userInput}
        onChange={(e) => onUserType(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Focus Overlay if clicked away */}
      {!isFocused && gameStatus !== "finished" && (
        <div className="focus-overlay" onClick={handleContainerClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          Click or press any key to focus
        </div>
      )}

      {/* Words Box */}
      <div className="words-container">
        {words.map((word, wordIndex) => {
          const wordStartIndex = charCounter;
          const wordChars = word.split("");
          
          // Next index after this word (plus space if not the last word)
          const isLastWord = wordIndex === words.length - 1;
          const spaceIndex = wordStartIndex + wordChars.length;
          charCounter = spaceIndex + (isLastWord ? 0 : 1);

          return (
            <div className="word" key={wordIndex}>
              {wordChars.map((char, charIdx) => {
                const globalIndex = wordStartIndex + charIdx;
                const isCurrent = globalIndex === userInput.length;
                let statusClass = "";

                if (globalIndex < userInput.length) {
                  statusClass = char === userInput[globalIndex] ? "correct" : "incorrect";
                }

                return (
                  <span
                    key={charIdx}
                    className={`char ${statusClass}`}
                  >
                    {isCurrent && <span className="caret" />}
                    {char}
                  </span>
                );
              })}

              {/* Space character after word */}
              {!isLastWord && (
                <span
                  className={`char ${
                    spaceIndex < userInput.length
                      ? userInput[spaceIndex] === " "
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  style={{ display: "inline-block", width: "10px" }}
                >
                  {spaceIndex === userInput.length && <span className="caret" />}
                  {" "}
                </span>
              )}
            </div>
          );
        })}

        {/* Caret at the end of the text */}
        {userInput.length >= paragraph.length && paragraph.length > 0 && (
          <span className="caret" />
        )}
      </div>

      {/* Restart Button */}
      <div className="restart-bar">
        <button
          className="restart-btn"
          onClick={onRestart}
          title="Restart Test (Tab or Esc)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          restart
        </button>
      </div>
    </div>
  );
};

export default TypingArea;
