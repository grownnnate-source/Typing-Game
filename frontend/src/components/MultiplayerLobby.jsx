import React, { useState } from "react";

const MultiplayerLobby = ({
  room,
  playerId,
  playerName,
  setPlayerName,
  onCreateRoom,
  onJoinRoom,
  onStartRace,
  onLeaveRoom,
  onSwitchToSolo,
  errorMessage
}) => {
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // View when not yet inside a room (Main Gaming Landing Page)
  if (!room) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "520px",
          width: "100%",
          margin: "30px auto",
          padding: "36px 32px",
          backgroundColor: "#131b2e",
          borderRadius: "20px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(56, 189, 248, 0.15)",
          border: "1px solid #1e293b",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow ambient background accent */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "240px",
            height: "120px",
            background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.25), transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "700",
            color: "#38bdf8",
            letterSpacing: "0.5px"
          }}
        >
          <span>⚔️</span>
          <span>REAL-TIME 1v1 & MULTIPLAYER SPEED BATTLES</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Challenge Friends in a Typing Duel
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5 }}>
            Create a private battle room or enter a friend's PIN code. Race character-by-character with live multi-player cursor tracking!
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            width: "100%"
          }}
        >
          <span style={{ fontSize: "11px", color: "#64748b", padding: "4px 10px", backgroundColor: "#0b0f19", borderRadius: "6px", border: "1px solid #1e293b" }}>
            🏎️ Live Opponent Carets
          </span>
          <span style={{ fontSize: "11px", color: "#64748b", padding: "4px 10px", backgroundColor: "#0b0f19", borderRadius: "6px", border: "1px solid #1e293b" }}>
            ⚡ Instant Sync
          </span>
          <span style={{ fontSize: "11px", color: "#64748b", padding: "4px 10px", backgroundColor: "#0b0f19", borderRadius: "6px", border: "1px solid #1e293b" }}>
            🏆 Podium & Leaderboard
          </span>
        </div>

        {errorMessage && (
          <div
            style={{
              width: "100%",
              padding: "10px 14px",
              backgroundColor: "rgba(244, 63, 94, 0.15)",
              border: "1px solid #f43f5e",
              borderRadius: "8px",
              color: "#f43f5e",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Player Name */}
        <div style={{ width: "100%" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px", letterSpacing: "0.5px" }}>
            YOUR RACER NICKNAME
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter nickname..."
            maxLength={16}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "#0b0f19",
              border: "1px solid #1e293b",
              borderRadius: "10px",
              color: "#f1f5f9",
              fontFamily: "inherit",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.15s ease"
            }}
            onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
            onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
          />
        </div>

        {/* Create Room Button */}
        <button
          onClick={onCreateRoom}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#38bdf8",
            color: "#0b0f19",
            fontWeight: "800",
            fontSize: "15px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(56, 189, 248, 0.35)",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1.0)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>🏁</span>
          <span>Create Private Battle Room</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>OR ENTER ROOM PIN</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
        </div>

        {/* Join Room */}
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && onJoinRoom(joinCode)}
            placeholder="Room PIN (e.g. K9P2)"
            maxLength={6}
            style={{
              flex: 1,
              padding: "12px 14px",
              backgroundColor: "#0b0f19",
              border: "1px solid #1e293b",
              borderRadius: "10px",
              color: "#f1f5f9",
              fontFamily: "inherit",
              fontSize: "15px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              outline: "none"
            }}
          />
          <button
            onClick={() => onJoinRoom(joinCode)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#1e293b",
              color: "#f1f5f9",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background-color 0.15s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e293b")}
          >
            Join Race
          </button>
        </div>

        {/* Solo Practice link */}
        {onSwitchToSolo && (
          <div style={{ marginTop: "4px", fontSize: "13px", color: "#64748b" }}>
            Want to warm up by yourself first?{" "}
            <span
              onClick={onSwitchToSolo}
              style={{
                color: "#38bdf8",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Switch to Solo Practice
            </span>
          </div>
        )}
      </div>
    );
  }

  // View when inside a room lobby
  const isHost = room.hostId === playerId;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        maxWidth: "520px",
        width: "100%",
        margin: "30px auto",
        padding: "32px",
        backgroundColor: "#151d2f",
        borderRadius: "16px",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
      }}
    >
      {/* Room Header with Code */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>ROOM CODE</span>
          <span style={{ fontSize: "28px", fontWeight: "700", color: "#38bdf8", letterSpacing: "2px" }}>
            #{room.id}
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          style={{
            padding: "8px 14px",
            backgroundColor: "#0b0f19",
            color: copied ? "#34d399" : "#64748b",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          {copied ? "✓ Copied" : "📋 Copy Code"}
        </button>
      </div>

      {/* Players List */}
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>PLAYERS ({room.players?.length || 0}/5)</span>
          <span style={{ fontSize: "12px", color: "#64748b" }}>COLORS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {room.players?.map((player) => {
            const isSelf = player.id === playerId;
            return (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  backgroundColor: "#0b0f19",
                  borderRadius: "8px",
                  border: isSelf ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #1e293b"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Colored Avatar Dot */}
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: player.color,
                      display: "inline-block",
                      boxShadow: `0 0 8px ${player.color}66`
                    }}
                  />
                  <span style={{ fontWeight: isSelf ? "600" : "500", color: "#f1f5f9" }}>
                    {player.name} {isSelf && <span style={{ color: "#38bdf8", fontSize: "12px" }}>(You)</span>}
                  </span>
                </div>

                {player.isHost && (
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: "rgba(251, 191, 36, 0.15)",
                      color: "#fbbf24",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: "600"
                    }}
                  >
                    👑 HOST
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        {isHost ? (
          <button
            onClick={onStartRace}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#34d399",
              color: "#0b0f19",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Start Race 🚀
          </button>
        ) : (
          <div
            style={{
              padding: "12px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "14px",
              backgroundColor: "#0b0f19",
              borderRadius: "8px"
            }}
          >
            Waiting for host to start the race...
          </div>
        )}

        <button
          onClick={onLeaveRoom}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "13px",
            cursor: "pointer",
            padding: "8px"
          }}
          onMouseEnter={(e) => (e.target.style.color = "#f43f5e")}
          onMouseLeave={(e) => (e.target.style.color = "#64748b")}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
