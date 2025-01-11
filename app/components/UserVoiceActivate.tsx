"use client";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getUserName } from "../utils/randomFuncs/randFuncs";
import { nameType } from "./MainComponent";

type props = {
	socket: Socket | null;
	userName: nameType;
};

const RESET_TIME = 250;

function UserVoiceActivate({ socket, userName }: props) {
	const [render, setRender] = useState(0);
	const [active, setActive] = useState(false);
	const [setfName, setSelfName] = useState(() => getUserName());

	const setfNameRef = useRef(setfName);
	const acRef = useRef(active);
	const timeOutRef = useRef<NodeJS.Timeout>();

	const isTalking = useAppSelector((state) => state.mainStatusSlice.isTalking);

	const cancelUserActivision = () => {
		if (acRef.current) {
			setActive(false);
			acRef.current = false;
			setRender((prev) => prev + 1);
		}
	};

	const activeUserActivision = () => {
		if (!acRef.current) {
			setActive(true);
			acRef.current = true;
			setRender((prev) => prev + 1);
		}
	};

	const manageUserActivision = (id: string) => {
		if (userName.clientId === id) {
			if (!acRef.current) {
				activeUserActivision();
			} else {
				clearTimeout(timeOutRef.current);
				timeOutRef.current = setTimeout(() => {
					cancelUserActivision();
				}, RESET_TIME);
			}
		}
	};

	const activeSelf = () => {
		if (isTalking) {
			activeUserActivision();
		} else {
			cancelUserActivision();
		}
	};

	useEffect(() => {
		if (userName.clientId !== setfNameRef.current.clientId) {
			socket?.on("audio-data", (data: any, name: nameType) => {
				manageUserActivision(name.clientId);
			});

			socket?.on("audio-input-canceled", (name: nameType) => {
				if (userName.clientId === name.clientId) {
					cancelUserActivision();
				}
			});
		}
	}, [socket]);

	useEffect(() => {
		if (userName.clientId === setfNameRef.current.clientId) {
			activeSelf();
		}
	}, [isTalking]);

	return (
		<div
			style={active ? { boxShadow: "0 0 0 2px lightGreen" } : {}}
			className="mr-2 rounded-full w-6 h-6 bg-neutral-500 flex justify-center items-center"
		>
			<span className="text-white text-sm">{userName.userName[0].toUpperCase()}</span>
		</div>
	);
}

export default UserVoiceActivate;
