import React, { useState, useEffect } from "react";
import "./App.css";
import MidiComponent from "./components/MidiComponent";
import MidiPlayer from "./components/MidiPlayer";
import Playbar from "./components/Playbar";
import midiPath from "./assets/groove.mid";
import { Midi } from "@tonejs/midi";

function App() {
  const [midiData, setMidiData] = useState(null);

  useEffect(() => {
    const loadMidi = async () => {
      try {
        const response = await fetch(midiPath);

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
    <div className="App">
      <h1>Midi Player</h1>
      <MidiComponent midiData={midiData} />
      <MidiPlayer midiData={midiData} />
      {midiData && <Playbar duration={midiData.duration} />}
    </div>
  );
}

export default App;


