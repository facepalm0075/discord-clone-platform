import { Socket } from "socket.io-client";
import { globalSoundVars as globalSoundVarsType } from "./MainComponent";
import { isFireFoxBrowser, startREC, stopREC } from "./audioStreamFuncs";
import { appendArrays, getSampleRate, getUserName } from "../utils/randomFuncs/randFuncs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { setIsTalking } from "../redux/slices/mainStatusSlice";
const { Encoder } = require("libopus.js");

let audioBuff: any[] = [];
let globalSoundVars: globalSoundVarsType = {
	audioContext: null,
	audioStream: null,
	soundApiNode: null,
};
const SPLICE_SIZE = 20;
let isMute = false;
let joinedRoom: string | null = null;

let thresholdDb = -50;

const encoder = new Encoder({ rate: 24000, channels: 1 });
const frameSize = 480; // 20ms at 24kHz
let pcmBuffer: any = []; // Temporary buffer to accumulate samples

function downsampleAudio(audioData: any, originalSampleRate: any, targetSampleRate: any) {
	const ratio = originalSampleRate / targetSampleRate;
	const newLength = Math.floor(audioData.length / ratio);
	const resampledData = new Float32Array(newLength);

	for (let i = 0; i < newLength; i++) {
		resampledData[i] = audioData[Math.floor(i * ratio)];
	}

	return resampledData;
}
const isFireFox = isFireFoxBrowser();
let originalSampleRate: any = null;
const targetSampleRate = 24000;

export const useVoiceSend = (socket: Socket | null) => {
	const muteStatus = useAppSelector((state) => state.mainStatusSlice.isMuted);
	const conStatus = useAppSelector((state) => state.mainStatusSlice.isConnected);
	const room = useAppSelector((state) => state.mainStatusSlice.joinedRoom);
	const sensitivity = useAppSelector((state) => state.mainStatusSlice.micensitivity);
	thresholdDb = sensitivity;

	const dispatch = useAppDispatch();

	const timeOutRef = useRef<NodeJS.Timeout>();

	joinedRoom = room;
	isMute = muteStatus;

	const name = getUserName();

	const actNcanMic = () => {
		dispatch(setIsTalking(true));
		if (timeOutRef.current !== undefined) {
			clearTimeout(timeOutRef.current);
		}
		timeOutRef.current = setTimeout(() => {
			dispatch(setIsTalking(false));
		}, 250);
	};

	const cbHandler = (pcmData: any[]) => {
		if (!isMute) {
			// Add incoming samples to the buffer

			const resampledData = isFireFox
				? downsampleAudio(pcmData, originalSampleRate, targetSampleRate)
				: pcmData;
			pcmBuffer.push(...(resampledData as any));

			// While there are enough samples for one frame, encode them
			while (pcmBuffer.length >= frameSize) {
				// Extract one frame of data
				const frame = pcmBuffer.slice(0, frameSize);
				pcmBuffer = pcmBuffer.slice(frameSize); // Remove processed samples from buffer

				// Encode the frame
				const encodedPacket = encoder.encode(new Float32Array(frame));
				socket?.emit("audio-input", encodedPacket, joinedRoom, name);
				actNcanMic();
			}
			// audioBuff.push(data);
			// if (audioBuff.length >= SPLICE_SIZE) {
			// 	const temp = audioBuff.splice(0, SPLICE_SIZE);
			// 	const combinedArray = appendArrays(temp, data.length * SPLICE_SIZE);
			// 	socket?.emit("audio-input", combinedArray, joinedRoom, name);
			// 	actNcanMic();
			// }
		}
	};

	const cbHandlerCancel = () => {
		if (!isMute) {
			socket?.emit("audio-input-cancel", joinedRoom, name);
		}
	};

	function startRecording() {
		audioBuff = [];
		pcmBuffer = [];
		startREC(globalSoundVars, cbHandler, cbHandlerCancel, thresholdDb);
	}
	function stopRecording() {
		pcmBuffer = [];
		audioBuff = [];
		stopREC(globalSoundVars);
	}

	useEffect(() => {
		originalSampleRate = getSampleRate();
	}, []);

	useEffect(() => {
		conStatus ? startRecording() : stopRecording();
	}, [conStatus]);

	useEffect(() => {
		if (globalSoundVars.soundApiNode && globalSoundVars.soundApiNode instanceof AudioWorkletNode) {
			globalSoundVars.soundApiNode.port.postMessage({ thresholdDb });
		}
	}, [sensitivity]);
};
