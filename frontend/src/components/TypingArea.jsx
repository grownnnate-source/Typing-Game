import React, { useRef, useEffect, useState } from "react";

const TypingArea = ({
  paragraph,
  userInput,
  onUserType,
  onRestart,
  gameStatus,
  countdown,
  opponents = [],
  isMultiplayer = false
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  // Auto focus input
  useEffect(() => {
    if (inputRef.current && gameStatus !== "countdown" && gameStatus !== "finished") {
      inputRef.current.focus();
    }
  }, [paragraph, gameStatus]);

  // Global keydown to catch keystrokes and focus
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (gameStatus === "countdown") return;

      if (!isMultiplayer && (e.key === "Tab" || e.key === "Escape")) {
        e.preventDefault();
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
  }, [onRestart, isMultiplayer, gameStatus]);

  const handleContainerClick = () => {
    if (inputRef.current && gameStatus !== "countdown") {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const words = paragraph ? paragraph.split(" ") : [];
  let charCounter = 0;

  // Helper to find opponents currently positioned at a specific character index
  const getOpponentsAtIndex = (index) => {
    return opponents.filter((opp) => opp.cursorIndex === index);
  };

  return (
    <div
      className="test-section"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ position: "relative" }}
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
        disabled={gameStatus === "countdown" || gameStatus === "finished"}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Countdown Overlay */}
      {gameStatus === "countdown" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(11, 15, 25, 0.8)",
            backdropFilter: "blur(4px)",
            borderRadius: "12px",
            zIndex: 20
          }}
        >
          <span
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "#38bdf8",
              textShadow: "0 0 30px rgba(56, 189, 248, 0.6)",
              lineHeight: 1
            }}
          >
            {countdown > 0 ? countdown : "GO!"}
          </span>
          <span style={{ fontSize: "14px", color: "#64748b", marginTop: "12px" }}>
            Get your fingers ready...
          </span>
        </div>
      )}

      {/* Focus Overlay if clicked away */}
      {!isFocused && gameStatus !== "finished" && gameStatus !== "countdown" && (
        <div className="focus-overlay" onClick={handleContainerClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          Click or press any key to focus
        </div>
      )}

      {/* Words Box */}
      <div className="words-container" style={{ position: "relative" }}>
        {words.map((word, wordIndex) => {
          const wordStartIndex = charCounter;
          const wordChars = word.split("");
          const isLastWord = wordIndex === words.length - 1;
          const spaceIndex = wordStartIndex + wordChars.length;
          charCounter = spaceIndex + (isLastWord ? 0 : 1);

          return (
            <div className="word" key={wordIndex}>
              {wordChars.map((char, charIdx) => {
                const globalIndex = wordStartIndex + charIdx;
                const isCurrent = globalIndex === userInput.length;
                const opponentsHere = getOpponentsAtIndex(globalIndex);

                let statusClass = "";
                if (globalIndex < userInput.length) {
                  statusClass = char === userInput[globalIndex] ? "correct" : "incorrect";
                }

                return (
                  <span
                    key={charIdx}
                    className={`char ${statusClass}`}
                    style={{ position: "relative" }}
                  >
                    {/* Local Player Caret */}
                    {isCurrent && <span className="caret" />}

                    {/* Competitor Cursors at this position */}
                    {opponentsHere.map((opp) => (
                      <span
                        key={opp.id}
                        style={{
                          position: "absolute",
                          top: "-2px",
                          bottom: "-2px",
                          left: 0,
                          width: "2.5px",
                          backgroundColor: opp.color,
                          borderRadius: "1px",
                          zIndex: 5,
                          boxShadow: `0 0 8px ${opp.color}99`,
                          pointerEvents: "none"
                        }}
                      >
                        {/* Mini floating name pill */}
                        <span
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: opp.color,
                            color: "#0b0f19",
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "1px 5px",
                            borderRadius: "3px",
                            whiteSpace: "nowrap",
                            marginBottom: "2px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.4)"
                          }}
                        >
                          {opp.name} {opp.wpm ? `${opp.wpm}w` : ""}
                        </span>
                      </span>
                    ))}

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
                  style={{ display: "inline-block", width: "10px", position: "relative" }}
                >
                  {spaceIndex === userInput.length && <span className="caret" />}

                  {/* Competitor Carets on spaces */}
                  {getOpponentsAtIndex(spaceIndex).map((opp) => (
                    <span
                      key={opp.id}
                      style={{
                        position: "absolute",
                        top: "-2px",
                        bottom: "-2px",
                        left: 0,
                        width: "2.5px",
                        backgroundColor: opp.color,
                        borderRadius: "1px",
                        zIndex: 5,
                        boxShadow: `0 0 8px ${opp.color}99`,
                        pointerEvents: "none"
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: opp.color,
                          color: "#0b0f19",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          whiteSpace: "nowrap",
                          marginBottom: "2px"
                        }}
                      >
                        {opp.name}
                      </span>
                    </span>
                  ))}

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

      {/* Restart Button (Single player only) */}
      {!isMultiplayer && (
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
      )}
    </div>
  );
};

export default TypingArea;
