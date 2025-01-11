import { useRef, useState, useEffect, useCallback } from "react";
import { getSampleRate } from "../randomFuncs/randFuncs";
import { useAppSelector } from "@/app/redux/hooks";

interface UseAudioBufferQueueOptions {
	sampleRate?: number; // Default sample rate
	bufferThreshold?: number; // Default buffer threshold (in frames)
}
let isDeafen = false;

const usePAQ2 = (initialOptions: UseAudioBufferQueueOptions = {}) => {
	const deafenStatus = useAppSelector((state) => state.mainStatusSlice.isDeafen);
	isDeafen = deafenStatus;

	const audioContextRef = useRef<AudioContext | null>(null);
	const bufferMapRef = useRef<Map<string, Float32Array[]>>(new Map()); // Map for multiple buffers

	// State to allow dynamic changes to sampleRate and bufferThreshold
	const [sampleRate, setSampleRate] = useState(initialOptions.sampleRate || 48000);
	const [bufferThreshold, setBufferThreshold] = useState(initialOptions.bufferThreshold || 48000);

	useEffect(() => {
		// Initialize the AudioContext
		if (!audioContextRef.current) {
			audioContextRef.current = new AudioContext();
			const rate = getSampleRate();
			setSampleRate(rate);
			setBufferThreshold(rate / 2);
		}
		return () => {
			// Cleanup
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		};
	}, []);

	const audioBufferSetter = (data: Float32Array, name: string) => {
		if (isDeafen) {
			bufferMapRef.current.clear();
			return;
		}

		if (!bufferMapRef.current.has(name)) {
			bufferMapRef.current.set(name, []);
		}

		const queue = bufferMapRef.current.get(name);
		if (queue) {
			queue.push(data);
		}
	};

	const pushAudioData = useCallback(
		(data: Float32Array, name: string) => {
			audioBufferSetter(data, name);

			// Check if the buffer threshold is reached for the given name
			const queue = bufferMapRef.current.get(name);
			if (queue) {
				const totalFrames = queue.reduce((acc, buffer) => acc + buffer.length, 0);
				if (totalFrames >= bufferThreshold) {
					playAudio(name);
				}
			}
		},
		[bufferThreshold]
	);

	const playAudio = useCallback(
		(name: string) => {
			if (!audioContextRef.current) return;
			const audioContext = audioContextRef.current;

			// Ensure that AudioContext is resumed if needed (in case of suspended state)
			if (audioContext.state === "suspended") {
				audioContext
					.resume()
					.then(() => {
						console.log("AudioContext resumed");
					})
					.catch((err) => {
						console.error("Failed to resume AudioContext", err);
					});
			}

			// Get the buffer queue for the given name
			const queue = bufferMapRef.current.get(name);
			if (!queue || queue.length === 0) return;

			// Merge all buffers in the queue into one
			const totalFrames = queue.reduce((acc, buffer) => acc + buffer.length, 0);
			const mergedBuffer = new Float32Array(totalFrames);
			let offset = 0;
			queue.forEach((buffer) => {
				mergedBuffer.set(buffer, offset);
				offset += buffer.length;
			});

			// Clear the queue for the given name
			bufferMapRef.current.set(name, []);

			// Create an AudioBuffer and copy the merged data
			const audioBuffer = audioContext.createBuffer(1, mergedBuffer.length, sampleRate);
			audioBuffer.copyToChannel(mergedBuffer, 0);

			// Create a BufferSourceNode to play the buffer
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(audioContext.destination);
			source.start();

			source.onended = () => {
				// Check if more data is available to play for the same name
				const nextQueue = bufferMapRef.current.get(name);
				if (nextQueue && nextQueue.length > 0) {
					playAudio(name);
				}
			};
		},
		[sampleRate]
	);

	// Add this function to remove a buffer for a specific name
	const removeBufferByName = useCallback((name: string) => {
		if (bufferMapRef.current.has(name)) {
			bufferMapRef.current.delete(name);
		}
	}, []);

	return {
		pushAudioData,
		removeBufferByName,
	};
};

export default usePAQ2;
