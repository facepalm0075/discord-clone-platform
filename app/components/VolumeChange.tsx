"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { BsVolumeDown, BsVolumeUp } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setOutputVolume } from "../redux/slices/mainStatusSlice";

export default function VolumeChange() {
	const volume = useAppSelector((state) => state.mainStatusSlice.outputVolume) * 100;
	const dispatch = useAppDispatch();

	const handleChange = (event: Event, newValue: number | number[]) => {
		dispatch(setOutputVolume((newValue as number) / 100));
	};

	return (
		<div className="flex relative pl-5 gap-1  justify-center items-center">
			<div className="text-2xl">
				<BsVolumeDown />
			</div>
			<Box sx={{ width: "100%" }}>
				<Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
					<Slider
						aria-label="Volume"
						max={200}
						value={volume}
						onChange={handleChange}
						sx={{
							color: "var(--foreground-color)", // Change the track and thumb color
							"& .MuiSlider-thumb": {
								backgroundColor: "var(--foreground-color)", // Thumb color
								"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
									boxShadow: "none", // Remove focus shadow
								},
							},
							"& .MuiSlider-track": {
								backgroundColor: "var(--foreground-color)", // Track color
							},
							"& .MuiSlider-rail": {
								backgroundColor: "var(--n-400)", // Rail color
							},
						}}
					/>
				</Stack>
			</Box>
			<div className="text-2xl">
				<BsVolumeUp />
			</div>
		</div>
	);
}
