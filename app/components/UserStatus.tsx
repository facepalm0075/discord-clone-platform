"use client";
import { BsMicMuteFill } from "react-icons/bs";
import { MdHeadsetOff } from "react-icons/md";

import React from "react";

type props = {
	status: {
		muted: boolean;
		deafen: boolean;
	};
};

function UserStatus({ status }: props) {
	return (
		<div className="flex ml-auto gap-2 pr-2">
			{status.deafen && (
				<span>
					<MdHeadsetOff />
				</span>
			)}
			{status.muted && (
				<span>
					<BsMicMuteFill />
				</span>
			)}
		</div>
	);
}

export default UserStatus;
