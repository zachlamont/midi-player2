import React, { useCallback, useState } from 'react';
import { Midi } from '@tonejs/midi';

const MidiTransposer = () => {
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      
      // Transpose all notes up by one semitone, ensuring we stay within the MIDI range
      midi.tracks.forEach(track => {
        track.notes.forEach(note => {
          if (note.midi < 127) { // Ensure we don't exceed the MIDI note range
            note.midi += 1;
          }
        });
      });

      // Serialize the MIDI data back into a byte array
      const modifiedMidiArray = midi.toArray();
      const blob = new Blob([modifiedMidiArray], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error processing MIDI file:", error);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault(); // Necessary to allow for drop events
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ border: '2px dashed #ccc', padding: 20, textAlign: 'center' }}
    >
      Drag and drop a MIDI file here to transpose and download.
      {downloadUrl && (
        <div>
          <a href={downloadUrl} download="transposed.midi">Download Transposed MIDI</a>
        </div>
      )}
    </div>
  );
};

export default MidiTransposer;
