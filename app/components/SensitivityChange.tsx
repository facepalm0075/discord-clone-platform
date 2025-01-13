"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMicSensitivity } from "../redux/slices/mainStatusSlice";

const marks = [
	{
		value: -70,
		label: "-70db",
	},
	{
		value: -50,
		label: "-50db",
	},
	{
		value: -30,
		label: "-30db",
	},
	{
		value: -10,
		label: "-10db",
	},
];

export default function SensitivityChange() {
	const sensitivity = useAppSelector((state) => state.mainStatusSlice.micensitivity);
	const dispatch = useAppDispatch();
	const handleChange = (event: Event, newValue: number | number[]) => {
		dispatch(setMicSensitivity(newValue as number));
	};
	return (
		<div className="sens-change">
			<Box sx={{ width: "100%" }}>
				<Slider
					min={-70}
					max={-10}
					aria-label="Custom marks"
					value={sensitivity}
					step={1}
					marks={marks}
					onChange={handleChange}
					sx={{
						"& .MuiSlider-thumb": {
							"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
								boxShadow: "none", // Remove focus shadow
							},
						},
					}}
				/>
			</Box>
		</div>
	);
}
