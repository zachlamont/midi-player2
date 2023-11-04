// SeekablePlaybar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Transport } from "tone";

function SeekablePlaybar({ duration, isPlaying, onTogglePlayback }) {
  const [position, setPosition] = useState(0);
  const [transportInfo, setTransportInfo] = useState({
    seconds: 0,
    ticks: 0,
    position: "0:0:0",
    progress: 0,
  });

  // A reference to the progress bar container to calculate click/drag positions.
  const progressContainerRef = useRef(null);

  // Function to update the state with the current transport info
  const updateTransportInfo = () => {
    setTransportInfo({
      seconds: Transport.seconds,
      ticks: Transport.ticks,
      position: Transport.position,
      progress: Transport.loop ? Transport.progress : 0,
    });
  };

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

  // Use an effect to regularly update the visual playhead position to match the Transport's position
  // and to fetch the current transport information.
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(Transport.seconds);
      updateTransportInfo();
    }, 50);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleDrag);
    };
  }, []);

  return (
    <div className="seekable-playbar">
      <div className="seekable-playbar-left">
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
      </div>
      <div className="transport-info">
        <div>Seconds: {transportInfo.seconds.toFixed(2)}</div>
        <div>Ticks: {transportInfo.ticks}</div>
        <div>Position: {transportInfo.position}</div>
        <div>Progress: {(transportInfo.progress * 100).toFixed(2)}%</div>
      </div>
      <span className="timer">{Math.floor(position)}</span>
    </div>
  );
}

export default SeekablePlaybar;
