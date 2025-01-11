"use client";
import { configureStore } from "@reduxjs/toolkit";
import mainStatusSlice from "./slices/mainStatusSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			mainStatusSlice,
		},
	});
};

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
