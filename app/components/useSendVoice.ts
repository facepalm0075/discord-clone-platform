import { Socket } from "socket.io-client";
import { globalSoundVars as globalSoundVarsType } from "./MainComponent";
import { startREC, stopREC } from "./audioStreamFuncs";
import { appendArrays, getUserName } from "../utils/randomFuncs/randFuncs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { setIsTalking } from "../redux/slices/mainStatusSlice";

let audioBuff: any[] = [];
let globalSoundVars: globalSoundVarsType = {
	audioContext: null,
	audioStream: null,
	soundApiNode: null,
};
const SPLICE_SIZE = 20;
let isMute = false;
let joinedRoom: string | null = null;

export const useVoiceSend = (socket: Socket | null) => {
	const muteStatus = useAppSelector((state) => state.mainStatusSlice.isMuted);
	const conStatus = useAppSelector((state) => state.mainStatusSlice.isConnected);
	const room = useAppSelector((state) => state.mainStatusSlice.joinedRoom);

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

	const cbHandler = (data: Float32Array) => {
		if (!isMute) {
			audioBuff.push(data);
			if (audioBuff.length >= SPLICE_SIZE) {
				const temp = audioBuff.splice(0, SPLICE_SIZE);
				const combinedArray = appendArrays(temp, data.length * SPLICE_SIZE);
				socket?.emit("audio-input", combinedArray, joinedRoom, name);
				actNcanMic();
			}
		}
	};

	const cbHandlerCancel = () => {
		if (!isMute) {
			socket?.emit("audio-input-cancel", joinedRoom, name);
		}
	};

	function startRecording() {
		audioBuff = [];
		startREC(globalSoundVars, cbHandler, cbHandlerCancel);
	}
	function stopRecording() {
		audioBuff = [];
		stopREC(globalSoundVars);
	}

	useEffect(() => {
		conStatus ? startRecording() : stopRecording();
	}, [conStatus]);
};
