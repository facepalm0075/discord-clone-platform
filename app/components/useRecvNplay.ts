import { Socket } from "socket.io-client";
import { useEffect } from "react";
import usePAQ2 from "../utils/customHooks/usePAQ2";
import { useAppSelector } from "../redux/hooks";
import { nameType } from "./MainComponent";
const { Decoder } = require("libopus.js");

let isConnected = false;

const decoder: any = new Decoder({ rate: 24000, channels: 1 });

const buffer: any[] = [];

export const useRecvNplay = (socket: Socket | null) => {
	const conStatus = useAppSelector((state) => state.mainStatusSlice.isConnected);

	isConnected = conStatus;

	const { pushAudioData, removeBufferByName } = usePAQ2({
		sampleRate: 24000,
		bufferThreshold: 24000,
	});

	useEffect(() => {
		socket?.on("audio-data", (data: any[], name: nameType) => {
			if (isConnected) {
				const temp = decoder.decodeFloat32(Buffer.from(data));

				pushAudioData(temp, name.clientId);
			}
		});
		socket?.on("audio-input-canceled", (name: nameType) => {
			removeBufferByName(name.clientId);
		});
	}, [socket]);
};
