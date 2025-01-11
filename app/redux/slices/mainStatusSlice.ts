"use client";
import { nameType } from "@/app/components/MainComponent";
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
};

const initState: mainStatusType = {
	isMuted: false,
	isConnected: false,
	isDeafen: false,
	rooms: [],
	joinedRoom: null,
	joinedRoomUsers: [],
	isTalking: false,
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
} = mainStatusSlice.actions;
export default mainStatusSlice.reducer;
