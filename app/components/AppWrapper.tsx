"use client";

import React, { ReactNode, useEffect, useState } from "react";

type props = {
	children: ReactNode;
};
function AppWrapper({ children }: props) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") setIsLoaded(true);
	}, []);
	return <>{isLoaded && children}</>;
}

export default AppWrapper;
