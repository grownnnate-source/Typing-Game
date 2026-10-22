import React from "react";

const Navbar = ({ activeTab, setActiveTab, isInRoom }) => {
  return (
    <header className="header" style={{ paddingBottom: "16px", borderBottom: "1px solid #1e293b" }}>
      <div className="logo" onClick={() => !isInRoom && setActiveTab("solo")}>
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
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
        </svg>
        <div className="logo-text" style={{ fontSize: "22px", fontWeight: "700" }}>
          <span style={{ color: "#38bdf8" }}>Type</span>
          <span style={{ color: "#f1f5f9" }}>Race</span>
        </div>
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
          onClick={() => !isInRoom && setActiveTab("solo")}
          style={{
            padding: "6px 14px",
            backgroundColor: activeTab === "solo" ? "#38bdf8" : "transparent",
            color: activeTab === "solo" ? "#0b0f19" : "#64748b",
            fontWeight: "600",
            fontSize: "13px",
            border: "none",
            borderRadius: "6px",
            cursor: isInRoom ? "not-allowed" : "pointer",
            transition: "all 0.15s ease"
          }}
        >
          👤 Solo Practice
        </button>

        <button
          onClick={() => setActiveTab("multiplayer")}
          style={{
            padding: "6px 14px",
            backgroundColor: activeTab === "multiplayer" ? "#38bdf8" : "transparent",
            color: activeTab === "multiplayer" ? "#0b0f19" : "#64748b",
            fontWeight: "600",
            fontSize: "13px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          👥 Multiplayer Room
        </button>
      </div>
    </header>
  );
};

export default Navbar;
