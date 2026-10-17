import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-hint">
        <span>
          <span className="key-badge">tab</span> or <span className="key-badge">esc</span> - restart test
        </span>
      </div>

      <div className="footer-links">
        <a
          href="https://github.com/grownnnate-source/Typing-Game"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          github
        </a>
        <span style={{ color: "var(--sub-alt-color)" }}>•</span>
        <span className="footer-link" style={{ cursor: "default" }}>
          monkeytype inspired
        </span>
      </div>
    </footer>
  );
};

export default Footer;
