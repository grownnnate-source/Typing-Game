import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import ConfigToolbar from "./components/ConfigToolbar";
import TypingArea from "./components/TypingArea";
import ResultsCard from "./components/ResultsCard";
import Footer from "./components/Footer";

const App = () => {
  // Config
  const [mode, setMode] = useState("time"); // "time" | "words"
  const [timeOption, setTimeOption] = useState(30); // 15 | 30 | 60 | 120
  const [wordOption, setWordOption] = useState(25); // 10 | 25 | 50 | 100

  // Game state
  const [gameStatus, setGameStatus] = useState("ready"); // "ready" | "running" | "finished"
  const [rawParagraph, setRawParagraph] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    rawWpm: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    timeElapsed: 0,
    testType: "time 30",
  });

  const timerRef = useRef(null);

  // Fetch words from backend
  const fetchParagraph = async () => {
    try {
      const res = await axios.get("http://localhost:3000/paragraph");
      const text =
        typeof res.data === "string"
          ? res.data
          : res.data.words?.join(" ") || "";
      setRawParagraph(text);
    } catch (error) {
      console.error("Backend fetch error, using fallback words:", error);
      // Fallback word list if backend is offline
      setRawParagraph(
        "the quick brown fox jumps over the lazy dog through light and shadow across the silent river under ancient trees into the starry night beyond the horizon where dreams begin",
      );
    }
  };

  // On mount, load initial text
  useEffect(() => {
    fetchParagraph();
  }, []);

  // Format text according to mode
  useEffect(() => {
    if (!rawParagraph) return;

    if (mode === "words") {
      const wordsArr = rawParagraph.split(" ").slice(0, wordOption);
      setParagraph(wordsArr.join(" "));
    } else {
      setParagraph(rawParagraph);
    }
    resetGame();
  }, [rawParagraph, mode, wordOption, timeOption]);

  // Reset Game
  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setUserInput("");
    setGameStatus("ready");
    setTimeRemaining(timeOption);
    setStartTime(null);
  };

  // Full restart (refetch paragraph)
  const handleRestart = () => {
    resetGame();
    fetchParagraph();
  };

  // Complete the test and calculate final scores
  const finishGame = (finalInput = userInput, explicitDuration = null) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const now = Date.now();
    const duration =
      explicitDuration || Math.max(1, (now - (startTime || now)) / 1000);

    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < finalInput.length; i++) {
      if (finalInput[i] === paragraph[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const minutes = duration / 60;
    const finalWpm = Math.max(0, Math.round(correct / 5 / minutes));
    const finalRawWpm = Math.max(
      0,
      Math.round(finalInput.length / 5 / minutes),
    );
    const finalAccuracy =
      finalInput.length > 0
        ? Math.round((correct / finalInput.length) * 100)
        : 100;

    setStats({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      rawWpm: finalRawWpm,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: finalInput.length,
      timeElapsed: Math.round(duration),
      testType: mode === "time" ? `time ${timeOption}s` : `words ${wordOption}`,
    });

    setGameStatus("finished");
  };

  // Handle typing keystrokes
  const handleUserType = (value) => {
    if (gameStatus === "finished") return;

    // Start timer on first keystroke
    if (gameStatus === "ready" && value.length >= 1) {
      setGameStatus("running");
      setStartTime(Date.now());

      if (mode === "time") {
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    // Limit input length to paragraph
    if (value.length <= paragraph.length) {
      setUserInput(value);

      // In words mode, finish when player types the last character
      if (mode === "words" && value.length === paragraph.length) {
        finishGame(value);
      }
    }
  };

  // Check if time ran out
  useEffect(() => {
    if (mode === "time" && gameStatus === "running" && timeRemaining === 0) {
      finishGame(userInput, timeOption);
    }
  }, [timeRemaining, gameStatus, mode]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Mode / Time Config Toolbar */}
      <ConfigToolbar
        mode={mode}
        setMode={setMode}
        timeOption={timeOption}
        setTimeOption={setTimeOption}
        wordOption={wordOption}
        setWordOption={setWordOption}
        disabled={gameStatus === "running"}
      />

      {/* Main View: Typing Area vs Results Card */}
      {gameStatus === "finished" ? (
        <ResultsCard stats={stats} onRestart={handleRestart} />
      ) : (
        <main
          className="test-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}>
          {/* Live countdown or word progress */}
          <div className="live-counter">
            {mode === "time"
              ? timeRemaining
              : `${userInput.trim().split(" ").filter(Boolean).length}/${wordOption}`}
          </div>

          <TypingArea
            paragraph={paragraph}
            userInput={userInput}
            onUserType={handleUserType}
            onRestart={handleRestart}
            gameStatus={gameStatus}
          />
        </main>
      )}

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default App;
