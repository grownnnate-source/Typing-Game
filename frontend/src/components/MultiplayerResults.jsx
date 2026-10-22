import React from "react";

const MultiplayerResults = ({ room, playerId, onPlayAgain, onLeaveRoom }) => {
  const isHost = room.hostId === playerId;

  // Sort players by finishRank (1st, 2nd...) or by completion status
  const sortedPlayers = [...(room.players || [])].sort((a, b) => {
    if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
    if (a.finishRank) return -1;
    if (b.finishRank) return 1;
    return b.cursorIndex - a.cursorIndex;
  });

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇 1ST";
    if (rank === 2) return "🥈 2ND";
    if (rank === 3) return "🥉 3RD";
    return rank ? `#${rank}` : "DNF";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        maxWidth: "540px",
        width: "100%",
        margin: "20px auto",
        padding: "32px",
        backgroundColor: "#151d2f",
        borderRadius: "16px",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
        animation: "fadeIn 0.3s ease"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>
          Race Standings
        </h2>
        <span style={{ fontSize: "13px", color: "#64748b" }}>Room #{room.id}</span>
      </div>

      {/* Leaderboard Table */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedPlayers.map((player) => {
          const isSelf = player.id === playerId;
          return (
            <div
              key={player.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                backgroundColor: "#0b0f19",
                borderRadius: "10px",
                border: isSelf ? `1px solid ${player.color}` : "1px solid #1e293b"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: player.finishRank === 1 ? "#fbbf24" : "#f1f5f9",
                    minWidth: "60px"
                  }}
                >
                  {getRankBadge(player.finishRank)}
                </span>

                {/* Color Dot */}
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: player.color,
                    boxShadow: `0 0 8px ${player.color}88`
                  }}
                />

                <span style={{ fontWeight: isSelf ? "700" : "500", color: "#f1f5f9" }}>
                  {player.name} {isSelf && <span style={{ color: "#38bdf8", fontSize: "12px" }}>(You)</span>}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#38bdf8" }}>
                  {player.wpm} <span style={{ fontSize: "12px", color: "#64748b" }}>WPM</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
        {isHost ? (
          <button
            onClick={onPlayAgain}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#38bdf8",
              color: "#0b0f19",
              fontWeight: "700",
              fontSize: "15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Play Again 🔄
          </button>
        ) : (
          <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b", padding: "8px" }}>
            Waiting for host to restart...
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
          Back to Lobby
        </button>
      </div>
    </div>
  );
};

export default MultiplayerResults;
