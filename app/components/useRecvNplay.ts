import { Socket } from "socket.io-client";
import { useEffect } from "react";
import usePAQ2 from "../utils/customHooks/usePAQ2";
import { useAppSelector } from "../redux/hooks";
import { nameType } from "./MainComponent";

let isConnected = false;

export const useRecvNplay = (socket: Socket | null) => {
	const conStatus = useAppSelector((state) => state.mainStatusSlice.isConnected);

	isConnected = conStatus;

	const { pushAudioData, removeBufferByName } = usePAQ2({
		sampleRate: 48000,
		bufferThreshold: 48000,
	});

	useEffect(() => {
		socket?.on("audio-data", (data: any, name: nameType) => {
			if (isConnected) {
				pushAudioData(new Float32Array(data), name.clientId);
			}
		});
		socket?.on("audio-input-canceled", (name: nameType) => {
			removeBufferByName(name.clientId);
		});
	}, [socket]);
};
