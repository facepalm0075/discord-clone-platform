"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Thememode from "./ThemeBtn";

import UserNameChanger from "./UserNameChanger";
import Fullscreener from "./Fullscreener";

type props = {
	outClick: () => void;
};

function Setting({ outClick }: props) {
	return (
		<div
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					outClick();
				}
			}}
			className="absolute z-40 bg-opacity-50 bg-black h-full w-full fadeIn flex justify-center items-center"
		>
			<div
				style={{ borderColor: "var(--n-600)", backgroundColor: "var(--n-950)" }}
				className=" cont-full  px-3 py-2 rounded-xl border z-50 fadeInScaleUp"
			>
				<div
					style={{ borderColor: "var(--n-700)" }}
					className="flex justify-center items-center mb-4 pb-2 border-b"
				>
					<span style={{ color: "var(--n-600)" }} className="text-base">
						Setting
					</span>
					<IoMdClose className="ml-auto cursor-pointer text-xl" onClick={outClick} />
				</div>
				<div className="setting-items">
					<span>Appearance:</span>
					<Thememode />
				</div>
				<div className="setting-items">
					<span>Fullscreen:</span>
					<div className="ml-auto">
						<Fullscreener />
					</div>
				</div>
				<div className="setting-items">
					<span>Username:</span>
					<div className="ml-auto flex-1 ">
						<UserNameChanger />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Setting;
