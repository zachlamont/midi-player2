import React, { useState, useEffect, useRef } from "react";
import { Transport } from "tone";

function PianoRoll({ midiData }) {
  const [notes, setNotes] = useState([]);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const pianoRollRef = useRef(null);

  useEffect(() => {
    if (midiData) {
      const parsedNotes = midiData.tracks.flatMap((track) =>
        track.notes.map((note) => ({
          time: note.time,
          duration: note.duration,
          name: note.name,
          midi: note.midi,
        }))
      );
      setNotes(parsedNotes);
    }
  }, [midiData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Transport.state === "started") {
        setPlayheadPosition(Transport.seconds);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDrag = (e) => {
    if (pianoRollRef.current) {
      const bounds = pianoRollRef.current.getBoundingClientRect();
      const dragPosition = Math.max(e.clientX - bounds.left, 0); // Prevents negative position
      const newTime = Math.max(
        (dragPosition / bounds.width) * midiData.duration,
        0
      ); // Snaps to zero if negative
      setPlayheadPosition(newTime);
    }
  };

  const handleMouseUp = (e) => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);

    if (pianoRollRef.current) {
      const bounds = pianoRollRef.current.getBoundingClientRect();
      const clickPosition = Math.max(e.clientX - bounds.left, 0); // Prevents negative position
      const newTime = Math.max(
        (clickPosition / bounds.width) * midiData.duration,
        0
      ); // Snaps to zero if negative
      Transport.seconds = newTime;
    }
  };

  return (
    <div
      className="piano-roll"
      ref={pianoRollRef}
      onMouseDown={handleMouseDown}
      style={{ position: "relative" }} // Ensure that child components are positioned relative to this container
    >
      {notes.map((note, index) => (
        <Note key={index} note={note} />
      ))}

      <div
        className="playhead"
        style={{
          left: `${(playheadPosition / midiData.duration) * 100}%`,
          height: "100%",
          width: "2px",
          backgroundColor: "grey",
          position: "absolute",
          zIndex: 10,
        }}
      />
    </div>
  );
}

function Note({ note }) {
  // Styles as defined before or updated as needed
  const style = {
    left: `${note.time * 100}px`,
    width: `${note.duration * 100}px`,
    top: `${(127 - note.midi) * 10}px`,
    position: "absolute",
    backgroundColor: "blue",
    height: "10px",
  };

  return (
    <div className="note" style={style}>
      {note.name}
    </div>
  );
}

export default PianoRoll;
