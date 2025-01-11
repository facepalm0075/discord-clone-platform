import { useState, useRef, useCallback } from "react";

export const useAudioPlayer = (audioUrl: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Load the audio file and decode it
  const loadAudio = useCallback(async () => {
    if (audioBufferRef.current) return; // Avoid reloading if already loaded

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const response = await fetch(audioUrl);
      const audioData = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);

      audioBufferRef.current = audioBuffer;
    } catch (error) {
      console.error("Error loading audio file:", error);
    }
  }, [audioUrl]);

  // Play the audio
  const playAudio = useCallback(async () => {
    if (!audioBufferRef.current) {
      await loadAudio();
    }

    if (!audioBufferRef.current || !audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(0);

    sourceRef.current = source;
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
    };
  }, [loadAudio]);

  // Stop the audio
  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Toggle play/stop
  const toggleAudio = useCallback(async () => {
    if (isPlaying) {
      stopAudio();
    } else {
      await playAudio();
    }
  }, [isPlaying, playAudio, stopAudio]);

  return { isPlaying, playAudio, stopAudio, toggleAudio };
};
