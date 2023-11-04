// PianoRoll.jsx
import React, { useState, useEffect } from "react";

function PianoRoll({ midiData }) {
  // This assumes midiData is an object containing the notes and their timing information.
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (midiData) {
      // Here we convert midi data into a more useful format for rendering the piano roll.
      // You would replace this with your actual logic to parse midiData
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

  return (
    <div className="piano-roll">
      {notes.map((note, index) => (
        <Note key={index} note={note} />
      ))}
    </div>
  );
}

// A basic Note component that could be used to display individual notes.
// You'll need to calculate the style based on the note's timing and pitch.
function Note({ note }) {
  // The left position is based on the note's start time,
  // the width is based on the note's duration,
  // and the top position is based on the note's pitch (MIDI number).
  const style = {
    left: `${note.time * 100}px`, // This is a placeholder, use the actual conversion for your data
    width: `${note.duration * 100}px`, // This is a placeholder, use the actual conversion for your data
    top: `${(127 - note.midi) * 10}px`, // This assumes there are 127 MIDI notes
    position: "absolute",
    backgroundColor: "blue", // Placeholder color, you might want to change it
    height: "10px", // The height of each note
  };

  return (
    <div className="note" style={style}>
      {note.name}
    </div>
  );
}

export default PianoRoll;
