import { useEffect, useRef } from "react";

function usePlayAudioQueue() {
	const audioContextRef = useRef<AudioContext | null>(null);
	const queueRef = useRef<Float32Array[]>([]);
	const isPlayingRef = useRef(false);

	useEffect(() => {
		return () => {
			// Cleanup on unmount
			if (audioContextRef.current) {
				audioContextRef.current.close();
				console.log("unmounted player");
			}
		};
	}, []);

	const initializeAudioContext = () => {
		if (!audioContextRef.current) {
			audioContextRef.current = new AudioContext();
		}
	};

	const processQueue = () => {
		if (queueRef.current.length === 0) {
			isPlayingRef.current = false;
			return;
		}

		const chunk = queueRef.current.shift()!;
		const audioContext = audioContextRef.current!;
		const audioBuffer = audioContext.createBuffer(1, chunk.length, audioContext.sampleRate);

		// Copy data into AudioBuffer
		audioBuffer.copyToChannel(chunk, 0);

		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);

		source.start();
		source.onended = () => {
			processQueue(); // Play the next chunk
		};
	};

	const enqueueAudio = (chunk: Float32Array) => {
		initializeAudioContext();
		queueRef.current.push(chunk);

		if (!isPlayingRef.current) {
			isPlayingRef.current = true;
			processQueue();
		}
	};

	return { enqueueAudio };
}

export default usePlayAudioQueue;
