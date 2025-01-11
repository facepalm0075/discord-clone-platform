"use client";
import React, { useState } from "react";

type props = {
	callback: (input: string) => void;
};
function NameInput({ callback }: props) {
	const [name, setName] = useState("");

	return (
		<>
			<input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
			<button
				onClick={() => {
					if (name.length >= 3 && name.length <= 15) {
						callback(name);
					}
				}}
			>
				save
			</button>
		</>
	);
}

export default NameInput;
