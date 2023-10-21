// Playbar.jsx

import React, { useState, useEffect } from "react";
import { Transport } from "tone";

function Playbar({ duration }) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // Update position every 50 milliseconds for smoother movement
    const interval = setInterval(() => {
      setPosition(Transport.seconds);
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="playbar">
      <button
        className="play-pause-btn"
        onClick={() => {
          if (Transport.state === "started") {
            Transport.pause();
          } else {
            Transport.start();
          }
        }}
      >
        {Transport.state === "started" ? "Pause" : "Play"}
      </button>
      <div className="progress-container">
        <div
          className="progress"
          style={{ width: `${(position / duration) * 100}%` }}
        ></div>
      </div>
      <span className="timer">{Math.floor(position)}</span>
    </div>
  );
}

export default Playbar;
