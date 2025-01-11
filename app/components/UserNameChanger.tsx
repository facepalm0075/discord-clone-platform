"use client";

import React, { useEffect, useState } from "react";
import useLocalStorage from "../utils/customHooks/useLocalStorage";

const initer = () => {
	return {
		userName: "",
		clientId: "",
	};
};

function UserNameChanger() {
	const [val, setVal] = useLocalStorage("name", initer());
	const [input, setInput] = useState(val?.userName);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (input && val) {
			if (val.userName !== input && input.length >= 3 && input.length <= 15) {
				setIsActive(true);
			} else {
				setIsActive(false);
			}
		}
	}, [input]);

	const handleSave = () => {
		const userConfirmed = window.confirm("Do you want to refresh the page?");
		if (userConfirmed) {
			if (val) {
				setVal({ ...val, userName: input! });
			}
			window.location.reload();
		} else {
			setInput(val?.userName);
		}
	};

	return (
		<div className="flex pl-3 relative">
			<input
				style={{ borderColor: "var(--n-400)", backgroundColor: "var(--n-800)" }}
				type="text"
				className="w-full border rounded-lg pl-2 pr-12"
				placeholder=""
				value={input}
				onChange={(e) => {
					setInput(e.currentTarget.value);
				}}
				spellCheck="false"
			/>
			<div
				style={{
					color: isActive ? "var(--background-color)" : "var(--n-700)",
					backgroundColor: isActive ? "var(--foreground-color)" : "var(--n-400)",
					paddingTop: "1px",
					transition: "all 0.3s",
					cursor: isActive ? "pointer" : "default",
					pointerEvents: isActive ? "auto" : "none",
				}}
				className="absolute right-0 text-sm font-bold h-full rounded-r-lg px-1"
				onClick={handleSave}
			>
				save
			</div>
		</div>
	);
}

export default UserNameChanger;
