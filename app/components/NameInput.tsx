"use client";
import React, { useEffect, useState } from "react";

type props = {
	callback: (input: string) => void;
};
function NameInput({ callback }: props) {
	const [name, setName] = useState("");
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (name.length >= 3 && name.length <= 15) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [name]);

	const handleSave = () => {
		callback(name);
	};

	return (
		<>
			<input
				type="text"
				value={name}
				style={{ borderColor: "var(--n-400)", backgroundColor: "var(--n-800)" }}
				className="w-full border rounded-lg px-3 py-1"
				placeholder="Username..."
				spellCheck="false"
				onChange={(e) => setName(e.currentTarget.value)}
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
				className="text-sm font-bold rounded-lg px-3 py-1 inline-block mt-4"
				onClick={handleSave}
			>
				Submit
			</div>
		</>
	);
}

export default NameInput;
