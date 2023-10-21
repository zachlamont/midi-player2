import React, { useState, useEffect } from "react";
import { Sampler, Part, Transport } from "tone";
import { Midi } from "@tonejs/midi";
import midiPath from "../assets/groove.mid";

const MidiPlayer = () => {
  // Removed { midiData } from here
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiData, setMidiData] = useState(null); // Kept this as local state
  const [sampler, setSampler] = useState(null);
  const [part, setPart] = useState(null);

  const togglePlayback = async () => {
    if (Transport.context.state !== "running") {
      await Transport.context.resume();
    }

    if (isPlaying) {
      Transport.pause();
      setIsPlaying(false);
    } else {
      Transport.start();
      setIsPlaying(true);
    }
  };

  const loadMidiAndSetupSampler = async () => {
    try {
      const response = await fetch(midiPath);

      if (!response.ok) {
        console.error("Failed to fetch the MIDI file:", response.statusText);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      setMidiData(midi);

      const samplerInstance = new Sampler(
        {
          A1: "A1.mp3",
          A2: "A2.mp3",
        },
        {
          baseUrl: "https://tonejs.github.io/audio/casio/",
        }
      ).toDestination();

      const midiNotes = midi.tracks[0].notes.map((note) => ({
        time: note.time,
        note: note.name,
        velocity: note.velocity,
        duration: note.duration,
      }));

      const partInstance = new Part((time, note) => {
        samplerInstance.triggerAttackRelease(
          note.note,
          note.duration,
          time,
          note.velocity
        );
      }, midiNotes).start(0);

      setSampler(samplerInstance);
      setPart(partInstance);
      Transport.loop = true;
      Transport.loopEnd = midi.duration;
    } catch (error) {
      console.error("Error loading or processing the MIDI file:", error);
    }
  };

  useEffect(() => {
    loadMidiAndSetupSampler();
    return () => {
      // Cleanup on component unmount
      part && part.dispose();
      sampler && sampler.dispose();
      Transport.stop();
    };
  }, []);

  return (
    <div>
      <button onClick={togglePlayback}>{isPlaying ? "Stop" : "Play"}</button>
    </div>
  );
};

export default MidiPlayer;
