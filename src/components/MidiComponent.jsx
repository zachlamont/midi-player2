import React, { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";
import midiPath from "../assets/groove.mid"; // Import the midi file

const MidiComponent = () => {
  // Removed the midiData prop
  const [midiData, setMidiData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  useEffect(() => {
    // Load and parse the midi file
    const loadMidi = async () => {
      try {
        const response = await fetch(midiPath); // Use the imported path

        if (!response.ok) {
          throw new Error("Failed to fetch the MIDI file.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const midi = new Midi(arrayBuffer);
        setMidiData(midi);
      } catch (error) {
        console.error("Error loading MIDI file:", error);
      }
    };

    loadMidi();
  }, []);

  return (
    <div className="midi-container">
      {midiData && (
        <>
          <div className={`json-content ${expanded ? "expanded" : ""}`}>
            <pre>{JSON.stringify(midiData, null, 2)}</pre>
          </div>
          <button onClick={toggleExpanded}>
            {expanded ? "Collapse" : "Expand"}
          </button>

          <div className="midi-info">
            <h3>MIDI Information:</h3>
            <p>
              <strong>Name:</strong> {midiData.header.name}
            </p>
            <p>
              <strong>Tempo:</strong> {midiData?.header?.tempos[0]?.bpm} BPM
            </p>
            <p>
              <strong>Duration:</strong> {midiData.duration} seconds
            </p>
            <p>
              <strong>Number of tracks:</strong> {midiData.tracks.length}
            </p>
            {midiData.tracks.map((track, index) => (
              <div key={index} className="track-info">
                <h4>Track {index + 1}:</h4>
                <p>
                  <strong>Instrument Name:</strong> {track.instrument.name}
                </p>
                <p>
                  <strong>Number of Notes:</strong> {track.notes.length}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MidiComponent;
