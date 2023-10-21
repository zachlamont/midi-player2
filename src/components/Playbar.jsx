import React, { useState, useEffect } from "react";
import { Transport } from "tone";

function Playbar({ duration, isPlaying, onTogglePlayback }) {
  const [position, setPosition] = useState(0);

  const onPlayPauseClick = async () => {
    await Tone.start();

    if (Transport.state === "started") {
      Transport.pause();
    } else {
      Transport.start();
    }
  };

  useEffect(() => {
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
        onClick={onTogglePlayback || onPlayPauseClick}
      >
        {isPlaying ? "Pause" : "Play"}
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
