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

  // View when not yet inside a room
  if (!room) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "460px",
          width: "100%",
          margin: "40px auto",
          padding: "32px",
          backgroundColor: "#151d2f",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          border: "1px solid #1e293b"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9", marginBottom: "8px" }}>
            Multiplayer Typing Race
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Race against up to 5 friends in real-time with live competitor cursors!
          </p>
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
          <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
            YOUR NICKNAME
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter nickname..."
            maxLength={16}
            style={{
              width: "100%",
              padding: "12px 14px",
              backgroundColor: "#0b0f19",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontFamily: "inherit",
              fontSize: "15px",
              outline: "none"
            }}
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
            fontWeight: "700",
            fontSize: "15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.1s ease, filter 0.1s ease"
          }}
          onMouseEnter={(e) => (e.target.style.filter = "brightness(1.1)")}
          onMouseLeave={(e) => (e.target.style.filter = "brightness(1.0)")}
        >
          Create Private Room
        </button>

        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
          <span style={{ fontSize: "12px", color: "#64748b" }}>OR JOIN CODE</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
        </div>

        {/* Join Room */}
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Room code (e.g. K9P2)"
            maxLength={6}
            style={{
              flex: 1,
              padding: "12px 14px",
              backgroundColor: "#0b0f19",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontFamily: "inherit",
              fontSize: "15px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              outline: "none"
            }}
          />
          <button
            onClick={() => onJoinRoom(joinCode)}
            style={{
              padding: "12px 20px",
              backgroundColor: "#1e293b",
              color: "#f1f5f9",
              fontWeight: "600",
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Join
          </button>
        </div>
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
