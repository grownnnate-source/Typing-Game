import React from "react";

const Navbar = ({ activeTab, setActiveTab, isInRoom }) => {
  return (
    <header className="header" style={{ paddingBottom: "16px", borderBottom: "1px solid #1e293b" }}>
      <div className="logo" onClick={() => !isInRoom && setActiveTab("multiplayer")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg
          className="logo-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#38bdf8" }}
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m10 13 2 2 4-4" />
        </svg>
        <div className="logo-text" style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#38bdf8" }}>Type</span>
          <span style={{ color: "#f1f5f9" }}>Arena</span>
        </div>
        <span
          style={{
            fontSize: "10px",
            fontWeight: "700",
            padding: "2px 7px",
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            borderRadius: "999px",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            letterSpacing: "0.5px"
          }}
        >
          LIVE RACING
        </span>
      </div>

      {/* Mode Switcher Pill */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#151d2f",
          padding: "4px",
          borderRadius: "8px",
          border: "1px solid #1e293b",
          gap: "4px"
        }}
      >
        <button
          onClick={() => setActiveTab("multiplayer")}
          style={{
            padding: "7px 16px",
            backgroundColor: activeTab === "multiplayer" ? "#38bdf8" : "transparent",
            color: activeTab === "multiplayer" ? "#0b0f19" : "#94a3b8",
            fontWeight: "700",
            fontSize: "13px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>🏁</span>
          <span>Race Friends</span>
        </button>

        <button
          onClick={() => !isInRoom && setActiveTab("solo")}
          style={{
            padding: "7px 16px",
            backgroundColor: activeTab === "solo" ? "#38bdf8" : "transparent",
            color: activeTab === "solo" ? "#0b0f19" : "#94a3b8",
            fontWeight: "600",
            fontSize: "13px",
            border: "none",
            borderRadius: "6px",
            cursor: isInRoom ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>🎯</span>
          <span>Solo Practice</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
