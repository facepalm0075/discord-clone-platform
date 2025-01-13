"use client";
import { nameType } from "@/app/components/MainComponent";
import presistState from "@/app/utils/randomFuncs/randFuncs";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

type mainStatusType = {
	isConnected: boolean;
	isMuted: boolean;
	isDeafen: boolean;
	rooms: string[] | null;
	joinedRoom: string | null;
	joinedRoomUsers: nameType[];
	isTalking: boolean;
	outputVolume: number;
	micensitivity: number;
};

const local1 = presistState("outputVolume");
const local2 = presistState("micensitivity");

const initState: mainStatusType = {
	isMuted: false,
	isConnected: false,
	isDeafen: false,
	rooms: [],
	joinedRoom: null,
	joinedRoomUsers: [],
	isTalking: false,
	outputVolume: local1.getLocalState(1.0),
	micensitivity: local2.getLocalState(-50),
};

const mainStatusSlice = createSlice({
	name: "mainStatusState",
	initialState: initState,
	reducers: {
		setIsConnected(state, action: PayloadAction<boolean>) {
			state.isConnected = action.payload;
		},
		setIsMuted(state, action: PayloadAction<boolean>) {
			state.isMuted = action.payload;
		},
		setIsDeafen(state, action: PayloadAction<boolean>) {
			state.isDeafen = action.payload;
		},
		toggleIsMuted(state, action: PayloadAction<void>) {
			state.isMuted ? (state.isMuted = false) : (state.isMuted = true);
		},
		toggleIsDeafen(state, action: PayloadAction<void>) {
			state.isDeafen ? (state.isDeafen = false) : (state.isDeafen = true);
		},
		setRooms(state, action: PayloadAction<string[]>) {
			state.rooms = action.payload;
		},
		setJoinedRoom(state, action: PayloadAction<string | null>) {
			state.joinedRoom = action.payload;
		},
		setJoinedRoomUsers(state, action: PayloadAction<nameType[]>) {
			state.joinedRoomUsers = action.payload;
		},
		setIsTalking(state, action: PayloadAction<boolean>) {
			state.isTalking = action.payload;
		},
		setOutputVolume(state, action: PayloadAction<number>) {
			state.outputVolume = action.payload;
			local1.localStateSaver(state.outputVolume);
		},
		setMicSensitivity(state, action: PayloadAction<number>) {
			state.micensitivity = action.payload;
			local2.localStateSaver(state.micensitivity);
		},
	},
});

export const {
	setIsConnected,
	setIsMuted,
	setIsDeafen,
	toggleIsMuted,
	toggleIsDeafen,
	setJoinedRoom,
	setRooms,
	setJoinedRoomUsers,
	setIsTalking,
	setOutputVolume,
	setMicSensitivity,
} = mainStatusSlice.actions;
export default mainStatusSlice.reducer;
