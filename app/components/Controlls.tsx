"use client";
import React from "react";
import { BsMicMuteFill, BsMicFill } from "react-icons/bs";
import { MdHeadsetOff, MdHeadset } from "react-icons/md";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	setIsConnected,
	setJoinedRoom,
	toggleIsDeafen,
	toggleIsMuted,
} from "../redux/slices/mainStatusSlice";
import { Socket } from "socket.io-client";
import { useJnDplayer } from "../utils/customHooks/useJnDplayer";
import { getUserName } from "../utils/randomFuncs/randFuncs";

type props = {
	socket: Socket | null;
};

const Controlls = ({ socket }: props) => {
	const [joinSound, leaveSound] = useJnDplayer();
	const muted = useAppSelector((state) => state.mainStatusSlice.isMuted);
	const deafen = useAppSelector((state) => state.mainStatusSlice.isDeafen);
	const connected = useAppSelector((state) => state.mainStatusSlice.isConnected);
	const room = useAppSelector((state) => state.mainStatusSlice.joinedRoom);
	const name = getUserName();
	const dispatch = useAppDispatch();

	const disconnectHandler = () => {
		dispatch(setJoinedRoom(null));
		socket?.emit("leave-joined-rooms");
		dispatch(setIsConnected(false));
		leaveSound();
	};

	return (
		<>
			<div
				style={deafen ? { color: "red" } : {}}
				className="c-icon"
				onClick={() => {
					dispatch(toggleIsDeafen());
					socket?.emit("user-status", { muted, deafen: !deafen });
				}}
			>
				{deafen ? <MdHeadsetOff /> : <MdHeadset />}
			</div>
			<div
				style={muted ? { color: "red" } : {}}
				className="c-icon"
				onClick={() => {
					dispatch(toggleIsMuted());
					socket?.emit("user-status", { muted: !muted, deafen });
					socket?.emit("audio-input-cancel", room, name);
				}}
			>
				{muted ? <BsMicMuteFill /> : <BsMicFill />}
			</div>
			{connected && (
				<>
					<div className="c-icon dc-icon" onClick={disconnectHandler}>
						<PiPhoneDisconnectFill />
					</div>
				</>
			)}
		</>
	);
};

export default Controlls;
