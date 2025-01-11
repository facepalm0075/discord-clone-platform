"use client";
import { Provider } from "react-redux";
import { store } from "./store";

import React, { ReactNode } from "react";

type props = {
	children: ReactNode;
};
function ReduxProvider({ children }: props) {
	return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
