"use client";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { getUserName } from "../utils/randomFuncs/randFuncs";
import { nameType } from "./MainComponent";

type props = {
	socket: Socket | null;
};

type message = {
	from: string;
	text: string;
	self?: boolean;
};

function TextChat({ socket }: props) {
	const [messages, setMessages] = useState<message[]>([]);
	const [input, setInput] = useState("");
	const name = getUserName();
	const room = useAppSelector((state) => state.mainStatusSlice.joinedRoom);

	const containerRef = useRef<HTMLDivElement>(null);

	const doScroll = (num: number = 150, def: boolean = false) => {
		setTimeout(() => {
			const cur = containerRef.current;
			if (cur) {
				if (def) {
					cur.scrollTop = cur.scrollHeight;
					return;
				}
				if (cur.scrollTop + cur.offsetHeight + num >= cur.scrollHeight)
					cur.scrollTop = cur.scrollHeight;
			}
		}, 10);
	};

	const getMessageStructure = (item: message, index: number, self?: boolean) => {
		return (
			<div key={index}>
				<div className={`flex gap-1 my-1 ${self && "justify-end"}`}>
					{!self && (
						<div
							style={{ backgroundColor: "var(--n-800)" }}
							className="mt-auto rounded-full flex justify-center items-center h-8 w-8 min-w-8 min-h-8 font-bold"
						>
							{item.from[0].toUpperCase()}
						</div>
					)}
					<div
						style={{ maxWidth: "80%", backgroundColor: self ? "var(--n-600)" : "var(--n-700)" }}
						className={`p-2 rounded-lg`}
					>
						<div style={{ color: "var(--black-white)" }} className=" font-bold text-sm">
							{item.from}
						</div>
						<div className="break-words">{item.text}</div>
					</div>
					{self && (
						<div
							style={{ backgroundColor: "var(--n-800)" }}
							className="mt-auto rounded-full flex justify-center items-center h-8 w-8 min-w-8 min-h-8 font-bold"
						>
							{item.from[0].toUpperCase()}
						</div>
					)}
				</div>
			</div>
		);
	};

	useEffect(() => {
		socket?.on("get-message", (from: nameType, text: string) => {
			setMessages((prev) => [...prev, { from: from.userName, text, self: false }]);
			doScroll();
		});
	}, [socket]);

	const handleSend = () => {
		socket?.emit("send-message", name, input, room);
		setMessages((prev) => [...prev, { from: name.userName, text: input, self: true }]);
		setInput("");
		doScroll();
	};

	return (
		<div
			style={{ backgroundColor: "var(--n-750)" }}
			className="h-full relative flex flex-col min-w-72"
		>
			<div style={{ backgroundColor: "var(--n-600)" }} className=" p-2 mb-2 font-bold text-sm">
				{room} Text Chat
			</div>
			<div ref={containerRef} className=" px-2 overflow-y-auto flex-1 relative">
				{messages.length === 0 ? (
					<div
						style={{ backgroundColor: "var(--n-800)" }}
						className="center-screen rounded-md px-3 py-1 text-sm"
					>
						No message yet...
					</div>
				) : (
					messages.map((item, index) => getMessageStructure(item, index, item.self))
				)}
			</div>
			<div className="p-4 w-full ">
				<input
					style={{
						borderColor: "var(--n-400)",
						backgroundColor: "var(--n-600)",
						color: "var(--black-white)",
					}}
					spellCheck="false"
					className="w-full py-1 px-2 rounded border outline-none"
					placeholder="Message"
					type="text"
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.keyCode === 13) {
							handleSend();
						}
					}}
				/>
			</div>
		</div>
	);
}

export default TextChat;
