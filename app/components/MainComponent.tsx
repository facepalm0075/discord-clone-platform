"use client";
import React, { useEffect, useState } from "react";
import { useSocketConnector } from "./useSocketConnector";
import { useVoiceSend } from "./useSendVoice";
import { useRecvNplay } from "./useRecvNplay";
import Controlls from "./Controlls";
import Channels from "./Channels";
import TextChat from "./TextChat";
import { useAppSelector } from "../redux/hooks";
import { IoMdSettings } from "react-icons/io";
import Setting from "./Setting";
import useIsMobile from "../utils/customHooks/useIsMoblime";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { HiSpeakerWave } from "react-icons/hi2";

export type globalSoundVars = {
	audioContext: AudioContext | null;
	audioStream: MediaStream | null;
	soundApiNode: AudioWorkletNode | ScriptProcessorNode | null;
};
export type nameType = {
	userName: string;
	clientId: string;
};

function MainComponent() {
	const isMobile = useIsMobile();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isSettingOpen, setIsSettingOpen] = useState(false);
	const { socket, socketConnect } = useSocketConnector("http://discord.pouyaprogramming.ir/chat");
	useEffect(() => {
		socketConnect();
	}, []);

	const joinedRoom = useAppSelector((state) => state.mainStatusSlice.joinedRoom);

	useVoiceSend(socket);
	useRecvNplay(socket);

	const settingHandler = () => {
		setIsSettingOpen(!isSettingOpen);
	};

	const toggleOpenChat = () => {
		setIsChatOpen(!isChatOpen);
	};

	useEffect(() => {
		if (!joinedRoom) {
			setIsChatOpen(false);
		}
	}, [joinedRoom]);

	useEffect(() => {
		if (!isMobile) {
			setIsChatOpen(false);
		}
	}, [isMobile]);

	return (
		<>
			{isSettingOpen && <Setting outClick={settingHandler} />}
			<div className="flex flex-col w-full h-full max-h-full absolute">
				<div style={{ maxHeight: "calc(100% - 71px)" }} className="flex-1 py-4">
					<div
						style={{
							margin: "auto",
							width: "96%",
							maxWidth: "1600px",
							borderColor: "var(--n-600)",
						}}
						className="chat-channels-container flex justify-center rounded-xl overflow-hidden border h-full"
					>
						<div
							style={{ width: isChatOpen ? "60px" : "256px", transition: "all 0.3s" }}
							className="channels-container relative"
						>
							{isMobile && isChatOpen && joinedRoom && (
								<div className="absolute w-full h-full z-10 bg-black bg-opacity-65 fadeIn"></div>
							)}
							<Channels socket={socket} />
						</div>
						<div style={{ width: "70px" }} className="chat-container flex-1 relative">
							{isMobile && joinedRoom && (
								<>
									<div
										onClick={toggleOpenChat}
										style={{
											backgroundColor: "var(--n-800)",
											color: "var(--foreground-color)",
											borderColor: "var(--n-600)",
											transform: `${isChatOpen ? "translate(-40px,0px)" : ""}`,
										}}
										className={`absolute left-0 z-20 top-1/2 text-3xl h-14 w-10 flex justify-center items-center border ${
											isChatOpen ? "rounded-l-xl border-r-0" : "rounded-r-xl border-l-0"
										}`}
									>
										{isChatOpen ? <HiSpeakerWave /> : <IoChatbubbleEllipses />}
									</div>
									{!isChatOpen && (
										<div className="absolute w-full h-full z-10 bg-black bg-opacity-65 fadeIn"></div>
									)}
								</>
							)}
							{joinedRoom ? <TextChat key={joinedRoom} socket={socket} /> : <></>}
						</div>
					</div>
				</div>
				<div className="flex justify-center">
					<div
						style={{ borderColor: "var(--n-700)", backgroundColor: "var(--n-900)" }}
						className="flex py-4 w-80 rounded-t-3xl border md:border-b-0 max-sm:rounded-3xl"
					>
						<div
							style={{ fontSize: "27px", borderColor: "var(--n-600)" }}
							className="border-r p-1 px-4 "
						>
							<IoMdSettings className="cursor-pointer" onClick={settingHandler} />
						</div>
						<div className="flex-1 flex justify-center items-center">
							<Controlls socket={socket} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MainComponent;
