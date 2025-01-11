"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setIsConnected, setJoinedRoom, setJoinedRoomUsers } from "../redux/slices/mainStatusSlice";
import { Socket } from "socket.io-client";
import { useJnDplayer } from "../utils/customHooks/useJnDplayer";
import { getUserName } from "../utils/randomFuncs/randFuncs";
import UserStatus from "./UserStatus";
import UserVoiceActivate from "./UserVoiceActivate";
import { HiSpeakerWave } from "react-icons/hi2";
import { nameType } from "./MainComponent";

type props = {
	socket: Socket | null;
};

type statusType = {
	muted: boolean;
	deafen: boolean;
};

export type userInRoomType = {
	id: string;
	name: nameType;
	status: statusType;
};

type usersRoomsType = {
	[key: string]: userInRoomType[] | undefined;
};

let joinedRoom: string | null = null;
let usersRooms: usersRoomsType = {};
let currentRoomUsers: nameType[] = [];

const compareChanges = (item1: userInRoomType[], item2: userInRoomType[]): 2 | 1 | 0 => {
	if (item1?.length > item2?.length) return 1;
	else if (item1?.length < item2?.length) return 0;

	return 2;
};

function Channels({ socket }: props) {
	const [trackedValue, setTrackedValue] = useState(currentRoomUsers);
	const [joinSound, leaveSound] = useJnDplayer();

	const rooms = useAppSelector((state) => state.mainStatusSlice.rooms);
	joinedRoom = useAppSelector((state) => state.mainStatusSlice.joinedRoom);
	const muted = useAppSelector((state) => state.mainStatusSlice.isMuted);
	const deafen = useAppSelector((state) => state.mainStatusSlice.isDeafen);

	const name = getUserName();
	const [renderer, setRenderer] = useState(0);
	const dispatch = useAppDispatch();

	const handleJoin = (room: string) => {
		if (joinedRoom !== room) {
			dispatch(setJoinedRoom(room));
			socket?.emit("join-to", room, name, { muted, deafen });
			dispatch(setIsConnected(true));
			setRenderer((prev) => prev + 1);
		}
	};

	const play = (num: 0 | 1) => {
		num ? joinSound() : leaveSound();
	};

	const changeUserRoom = (data: usersRoomsType) => {
		usersRooms = data;
		setRenderer((prev) => prev + 1);
		const tempRooms: nameType[] = [];
		if (joinedRoom) {
			data[joinedRoom]?.forEach((item) => {
				tempRooms.push(item.name);
			});
		}
		setTrackedValue(tempRooms);
	};

	useEffect(() => {
		socket?.on("rooms-status-changed", (data: usersRoomsType) => {
			if (joinedRoom && data[joinedRoom]) {
				const res = compareChanges(data[joinedRoom]!, usersRooms[joinedRoom]!);
				if (res !== 2) {
					play(res);
				}
			}
			changeUserRoom(data);
		});

		socket?.on("user-status-changed", (data: usersRoomsType) => {
			usersRooms = data;
			setRenderer((prev) => prev + 1);
		});

		socket?.on("rooms-status", (data: usersRoomsType) => {
			changeUserRoom(data);
		});

		socket?.emit("get-rooms-status");
	}, [socket]);

	useEffect(() => {
		dispatch(setJoinedRoomUsers(trackedValue));
	}, [trackedValue]);

	return (
		<div
			style={{ backgroundColor: "var(--n-800)" }}
			className="min-w-64 w-64 p-3 h-full overflow-y-auto"
		>
			<h2 style={{ color: "var(--black-white)" }} className="text-center block mb-4 font-bold">
				..:: Voice Rooms ::..
			</h2>
			{rooms?.map((item, index) => {
				return (
					<div onClick={() => handleJoin(item)} key={index}>
						<div className="flex gap-2 my-3 cursor-pointer">
							<div>{<HiSpeakerWave className="text-2xl" />}</div>
							<div> {item}</div>
						</div>
						<div className="pl-6">
							{usersRooms[item]?.map((item2) => {
								return (
									<div className="flex my-2 items-center" key={item2.name.clientId}>
										<UserVoiceActivate socket={socket} userName={item2.name!} />
										<span className="text-sm">{item2.name.userName}</span>

										<UserStatus status={item2.status} />
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Channels;
