import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [paragraph, setParagraph] = useState("");
  const [userInput , setUserInput] = useState("");

  async function getParagraph() {
    try {
      const res = await axios.get("http://localhost:3000/paragraph");
      console.log(res.data);
      setParagraph(res.data);
    } catch (error) {
      console.error("Error fetching paragraph:", error);
    }
  }

  useEffect(() => {
    getParagraph();
  }, []);

  return (
    <div>
      {!paragraph ? (
        <p>Loading paragraph...</p>
      ) : (
        <p style={{ fontSize: "1.5rem", fontFamily: "monospace", letterSpacing: "1px" }}>
          {paragraph.split("").map((char, index) => {
            let color = "#888"; // Not typed yet (gray)

            if (index < userInput.length) {
              color = char === userInput[index] ? "#4caf50" : "#f44336"; // Green if correct, Red if wrong
            }

            return (
              <span key={index} style={{ color }}>
                {char}
              </span>
            );
          })}
        </p>
      )}
      <input
        type="text"
        placeholder="Type here..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "1.1rem" }}
      />
    </div>
  );
};

export default App;
