import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { socket } from "./socket";
import Navbar from "./components/Navbar";
import ConfigToolbar from "./components/ConfigToolbar";
import TypingArea from "./components/TypingArea";
import ResultsCard from "./components/ResultsCard";
import MultiplayerLobby from "./components/MultiplayerLobby";
import MultiplayerResults from "./components/MultiplayerResults";
import Footer from "./components/Footer";

const App = () => {
  // Navigation: "multiplayer" (main gaming platform) vs "solo" (practice)
  const [activeTab, setActiveTab] = useState("multiplayer");

  // --- Solo State ---
  const [soloMode, setSoloMode] = useState("time");
  const [soloTimeOption, setSoloTimeOption] = useState(30);
  const [soloWordOption, setSoloWordOption] = useState(25);
  const [soloGameStatus, setSoloGameStatus] = useState("ready"); // "ready" | "running" | "finished"
  const [soloRawParagraph, setSoloRawParagraph] = useState("");
  const [soloParagraph, setSoloParagraph] = useState("");
  const [soloUserInput, setSoloUserInput] = useState("");
  const [soloTimeRemaining, setSoloTimeRemaining] = useState(30);
  const [soloStartTime, setSoloStartTime] = useState(null);
  const [soloStats, setSoloStats] = useState({
    wpm: 0,
    accuracy: 100,
    rawWpm: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    timeElapsed: 0,
    testType: "time 30"
  });
  const soloTimerRef = useRef(null);

  // --- Multiplayer State ---
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("typerace_name") || "Racer");
  const [playerId, setPlayerId] = useState(socket.id);
  const [room, setRoom] = useState(null);
  const [multiplayerStatus, setMultiplayerStatus] = useState("lobby"); // "lobby" | "countdown" | "racing" | "finished"
  const [multiplayerParagraph, setMultiplayerParagraph] = useState("");
  const [multiplayerUserInput, setMultiplayerUserInput] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const [opponents, setOpponents] = useState([]);

  // Save nickname
  useEffect(() => {
    localStorage.setItem("typerace_name", playerName);
  }, [playerName]);

  // Fetch solo paragraph from backend
  const fetchSoloParagraph = async () => {
    try {
      const res = await axios.get("http://localhost:3000/paragraph");
      const text = typeof res.data === "string" ? res.data : res.data.words?.join(" ") || "";
      setSoloRawParagraph(text);
    } catch (error) {
      console.error("Backend error, using fallback words:", error);
      setSoloRawParagraph(
        "the quick brown fox jumps over the lazy dog through light and shadow across the silent river under ancient trees into the starry night beyond the horizon where dreams begin"
      );
    }
  };

  useEffect(() => {
    fetchSoloParagraph();
  }, []);

  // Format solo paragraph based on settings
  useEffect(() => {
    if (!soloRawParagraph) return;

    if (soloMode === "words") {
      const wordsArr = soloRawParagraph.split(" ").slice(0, soloWordOption);
      setSoloParagraph(wordsArr.join(" "));
    } else {
      setSoloParagraph(soloRawParagraph);
    }
    resetSoloGame();
  }, [soloRawParagraph, soloMode, soloWordOption, soloTimeOption]);

  const resetSoloGame = () => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);
    setSoloUserInput("");
    setSoloGameStatus("ready");
    setSoloTimeRemaining(soloTimeOption);
    setSoloStartTime(null);
  };

  const handleSoloRestart = () => {
    resetSoloGame();
    fetchSoloParagraph();
  };

  const finishSoloGame = (finalInput = soloUserInput, explicitDuration = null) => {
    if (soloTimerRef.current) clearInterval(soloTimerRef.current);
    const now = Date.now();
    const duration = explicitDuration || Math.max(1, (now - (soloStartTime || now)) / 1000);

    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < finalInput.length; i++) {
      if (finalInput[i] === soloParagraph[i]) correct++;
      else incorrect++;
    }

    const minutes = duration / 60;
    const finalWpm = Math.max(0, Math.round(correct / 5 / minutes));
    const finalRawWpm = Math.max(0, Math.round(finalInput.length / 5 / minutes));
    const finalAccuracy = finalInput.length > 0 ? Math.round((correct / finalInput.length) * 100) : 100;

    setSoloStats({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      rawWpm: finalRawWpm,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: finalInput.length,
      timeElapsed: Math.round(duration),
      testType: soloMode === "time" ? `time ${soloTimeOption}s` : `words ${soloWordOption}`
    });
    setSoloGameStatus("finished");
  };

  const handleSoloUserType = (val) => {
    if (soloGameStatus === "finished") return;

    if (soloGameStatus === "ready" && val.length >= 1) {
      setSoloGameStatus("running");
      setSoloStartTime(Date.now());

      if (soloMode === "time") {
        soloTimerRef.current = setInterval(() => {
          setSoloTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(soloTimerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    setSoloUserInput(val);

    // Continuous typing in time mode: append more words when approaching the end
    if (soloMode === "time" && val.length >= soloParagraph.length - 40) {
      const extraWords = " wonder journey light future across echo horizon dream river forest whisper castle silent silver starlight meadow breeze cosmic ocean shadow vibrant rhythm wander";
      setSoloParagraph((prev) => prev + extraWords);
    }

    if (soloMode === "words" && val.length === soloParagraph.length) {
      finishSoloGame(val);
    }
  };

  useEffect(() => {
    if (soloMode === "time" && soloGameStatus === "running" && soloTimeRemaining === 0) {
      finishSoloGame(soloUserInput, soloTimeOption);
    }
  }, [soloTimeRemaining, soloGameStatus, soloMode]);

  // --- Socket.IO Multiplayer Listeners ---
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      setPlayerId(socket.id);
    });

    socket.on("room_updated", (updatedRoom) => {
      setRoom(updatedRoom);
      setMultiplayerStatus(updatedRoom.status);
      setOpponents(updatedRoom.players.filter((p) => p.id !== socket.id));
    });

    socket.on("countdown_started", ({ countdown: cd, paragraph }) => {
      setMultiplayerStatus("countdown");
      setCountdown(cd);
      setMultiplayerParagraph(paragraph);
      setMultiplayerUserInput("");
    });

    socket.on("countdown_tick", ({ countdown: cd }) => {
      setCountdown(cd);
    });

    socket.on("race_started", ({ paragraph, room: updatedRoom }) => {
      setMultiplayerStatus("racing");
      setCountdown(0);
      setMultiplayerParagraph(paragraph);
      setRoom(updatedRoom);
      setOpponents(updatedRoom.players.filter((p) => p.id !== socket.id));
    });

    socket.on("competitor_progress", ({ playerId: oppId, cursorIndex, wpm }) => {
      setOpponents((prev) =>
        prev.map((opp) => (opp.id === oppId ? { ...opp, cursorIndex, wpm } : opp))
      );
    });

    socket.on("race_finished", (finalRoom) => {
      setRoom(finalRoom);
      setMultiplayerStatus("finished");
    });

    return () => {
      socket.off("connect");
      socket.off("room_updated");
      socket.off("countdown_started");
      socket.off("countdown_tick");
      socket.off("race_started");
      socket.off("competitor_progress");
      socket.off("race_finished");
    };
  }, []);

  // Multiplayer Actions
  const handleCreateRoom = () => {
    setErrorMessage("");
    socket.emit("create_room", { playerName }, ({ success, room: newRoom, playerId: id, message }) => {
      if (success) {
        setRoom(newRoom);
        setPlayerId(id);
        setMultiplayerStatus("lobby");
        setOpponents(newRoom.players.filter((p) => p.id !== id));
      } else {
        setErrorMessage(message || "Failed to create room");
      }
    });
  };

  const handleJoinRoom = (code) => {
    if (!code) {
      setErrorMessage("Please enter a room code");
      return;
    }
    setErrorMessage("");
    socket.emit("join_room", { roomId: code, playerName }, ({ success, room: joinedRoom, playerId: id, message }) => {
      if (success) {
        setRoom(joinedRoom);
        setPlayerId(id);
        setMultiplayerStatus(joinedRoom.status);
        setOpponents(joinedRoom.players.filter((p) => p.id !== id));
      } else {
        setErrorMessage(message || "Failed to join room");
      }
    });
  };

  const handleStartRace = () => {
    if (room?.id) {
      socket.emit("start_race", { roomId: room.id });
    }
  };

  const handleLeaveRoom = () => {
    if (room?.id) {
      socket.emit("leave_room");
      setRoom(null);
      setMultiplayerStatus("lobby");
      setOpponents([]);
    }
  };

  const handlePlayAgain = () => {
    if (room?.id) {
      socket.emit("restart_race", { roomId: room.id });
    }
  };

  // Multiplayer typing handler (broadcasts cursor index & live WPM to competitors)
  const handleMultiplayerUserType = (val) => {
    if (multiplayerStatus !== "racing") return;

    if (val.length <= multiplayerParagraph.length) {
      setMultiplayerUserInput(val);

      // Calculate instantaneous WPM
      const elapsedMinutes = room?.startTime ? Math.max(1, (Date.now() - room.startTime) / 1000) / 60 : 0.1;
      const liveWpm = Math.round((val.length / 5) / elapsedMinutes);

      // Emit live cursor index to room competitors
      socket.emit("update_progress", {
        roomId: room.id,
        cursorIndex: val.length,
        wpm: liveWpm
      });
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar with Mode Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInRoom={!!room && multiplayerStatus === "racing"}
      />

      {/* ================= SOLO PRACTICE TAB ================= */}
      {activeTab === "solo" && (
        <>
          <ConfigToolbar
            mode={soloMode}
            setMode={setSoloMode}
            timeOption={soloTimeOption}
            setTimeOption={setSoloTimeOption}
            wordOption={soloWordOption}
            setWordOption={setSoloWordOption}
            disabled={soloGameStatus === "running"}
          />

          {soloGameStatus === "finished" ? (
            <ResultsCard stats={soloStats} onRestart={handleSoloRestart} />
          ) : (
            <main style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
              <div className="live-counter">
                {soloMode === "time"
                  ? soloTimeRemaining
                  : `${soloUserInput.trim().split(" ").filter(Boolean).length}/${soloWordOption}`}
              </div>

              <TypingArea
                paragraph={soloParagraph}
                userInput={soloUserInput}
                onUserType={handleSoloUserType}
                onRestart={handleSoloRestart}
                gameStatus={soloGameStatus}
                isMultiplayer={false}
              />
            </main>
          )}
        </>
      )}

      {/* ================= MULTIPLAYER RACE TAB ================= */}
      {activeTab === "multiplayer" && (
        <main style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {/* 1. Lobby / Room Creation View */}
          {(!room || multiplayerStatus === "lobby") && (
            <MultiplayerLobby
              room={room}
              playerId={playerId}
              playerName={playerName}
              setPlayerName={setPlayerName}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onStartRace={handleStartRace}
              onLeaveRoom={handleLeaveRoom}
              onSwitchToSolo={() => setActiveTab("solo")}
              errorMessage={errorMessage}
            />
          )}

          {/* 2. Active Race / Countdown View (Multi-Cursor Typing Area) */}
          {room && (multiplayerStatus === "countdown" || multiplayerStatus === "racing") && (
            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "16px" }}>
              {/* Room Header bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 18px",
                  backgroundColor: "#151d2f",
                  borderRadius: "10px",
                  border: "1px solid #1e293b"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#38bdf8" }}>
                    Room #{room.id}
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {room.players.length} Racers
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {room.players.map((p) => (
                    <span
                      key={p.id}
                      title={`${p.name} (${p.wpm || 0} WPM)`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: "#f1f5f9"
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: p.color
                        }}
                      />
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Multi-Cursor Typing Engine */}
              <TypingArea
                paragraph={multiplayerParagraph}
                userInput={multiplayerUserInput}
                onUserType={handleMultiplayerUserType}
                gameStatus={multiplayerStatus}
                countdown={countdown}
                opponents={opponents}
                isMultiplayer={true}
              />
            </div>
          )}

          {/* 3. Finished / Leaderboard View */}
          {room && multiplayerStatus === "finished" && (
            <MultiplayerResults
              room={room}
              playerId={playerId}
              onPlayAgain={handlePlayAgain}
              onLeaveRoom={handleLeaveRoom}
            />
          )}
        </main>
      )}

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default App;
