"use client";
import useFullscreen from "../utils/customHooks/useFullscreen";
import React from "react";
import { MdOutlineFullscreen } from "react-icons/md";
import { MdOutlineFullscreenExit } from "react-icons/md";

function Fullscreener() {
	const { toggleFullscreen, isFullscreen } = useFullscreen();
	return (
		<a
    style={{fontSize:"25px"}}
			onClick={() => {
				toggleFullscreen();
			}}
			className="ml-auto button"
		>
			{isFullscreen ? <MdOutlineFullscreenExit /> : <MdOutlineFullscreen />}
		</a>
	);
}

export default Fullscreener;
