// SeekablePlaybar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Transport } from "tone";

function SeekablePlaybar({ duration, isPlaying, onTogglePlayback }) {
  // State to track the current position of the playhead.
  const [position, setPosition] = useState(0);

  // A reference to the progress bar container to calculate click/drag positions.
  const progressContainerRef = useRef(null);

  // Function to handle when the mouse button is released after dragging.
  const handleMouseUp = (e) => {
    // Remove mouse event listeners once dragging is complete.
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleDrag);

    // Calculate the new playback position based on where the mouse was released.
    const bounds = progressContainerRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - bounds.left;
    const newTime = (clickPosition / bounds.width) * duration;

    // Set the Transport's position to the new playback position.
    Transport.seconds = newTime;
  };

  // Function to initiate the drag operation.
  const handleMouseDown = (e) => {
    // Add event listeners to handle dragging and releasing the mouse button.
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleDrag);
  };

  // Function to handle the dragging operation and update the playhead position visually.
  const handleDrag = (e) => {
    const bounds = progressContainerRef.current.getBoundingClientRect();
    const dragPosition = e.clientX - bounds.left;
    const newTime = (dragPosition / bounds.width) * duration;

    // Update the visual position of the playhead without changing the Transport's position.
    setPosition(newTime);
  };

  // Use an effect to regularly update the visual playhead position to match the Transport's position.
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(Transport.seconds);
    }, 50);

    return () => {
      // Cleanup by clearing the interval and removing any remaining event listeners.
      clearInterval(interval);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleDrag);
    };
  }, []);

  return (
    <div className="playbar">
      <button className="play-pause-btn" onClick={onTogglePlayback}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div
        className="progress-container"
        ref={progressContainerRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="progress"
          style={{ width: `${(position / duration) * 100}%` }}
        ></div>
      </div>
      <span className="timer">{Math.floor(position)}</span>
    </div>
  );
}

export default SeekablePlaybar;
