import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 640) => {
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < breakpoint);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Add event listener for window resize
		window.addEventListener("resize", handleResize);

		// Check initial size
		handleResize();

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [breakpoint]);

	return isMobile;
};

export default useIsMobile;
