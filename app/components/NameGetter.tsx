"use client";
import React, { ReactNode, useEffect, useState } from "react";
import useLocalStorage from "../utils/customHooks/useLocalStorage";
import NameInput from "./NameInput";
import { v4 as uuidv4 } from "uuid";

type props = {
	children: ReactNode;
};

const initer = () => {
	return {
		userName: "",
		clientId: "",
	};
};

function NameGetter({ children }: props) {
	const [val, setVal] = useLocalStorage("name", initer());

	const callbackHandler = (input: string) => {
		setVal({ userName: input, clientId: uuidv4() });
	};

	return (
		<>
			{val && val.userName && val.userName !== "" ? (
				children
			) : (
				<NameInput callback={callbackHandler} />
			)}
		</>
	);
}

export default NameGetter;
