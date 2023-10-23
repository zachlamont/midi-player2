import React, { useState, useEffect } from "react";
import "./App.css";
import MidiComponent from "./components/MidiComponent";
import MidiPlayer from "./components/MidiPlayer";
import Playbar from "./components/Playbar";
import SeekablePlaybar from "./components/SeekablePlaybar";
import midiPath from "./assets/groove.mid";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

function App() {
  const [midiData, setMidiData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    // Ensure Tone.js is ready to play
    await Tone.start();

    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

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
      <MidiPlayer isPlaying={isPlaying} onTogglePlayback={togglePlayback} />
      {midiData && (
        <Playbar
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          duration={midiData.duration}
        />
      )}

      {midiData && (
        <SeekablePlaybar
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          duration={midiData.duration}
        />
      )}
    </div>
  );
}

export default App;
