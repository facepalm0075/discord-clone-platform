import { useState } from "react";

interface UseFullscreenResult {
	isFullscreen: boolean;
	toggleFullscreen: () => void;
	exitFullscreen: () => void;
}

const useFullscreen = (): UseFullscreenResult => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const toggleFullscreen = () => {
		const target = document.documentElement; // Default to the whole page
		if (!isFullscreen) {
			if (target.requestFullscreen) {
				target.requestFullscreen();
			} else if ((target as any).webkitRequestFullscreen) {
				(target as any).webkitRequestFullscreen(); // Safari
			} else if ((target as any).msRequestFullscreen) {
				(target as any).msRequestFullscreen(); // IE11
			}
			setIsFullscreen(true);
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((document as any).webkitExitFullscreen) {
				(document as any).webkitExitFullscreen(); // Safari
			} else if ((document as any).msExitFullscreen) {
				(document as any).msExitFullscreen(); // IE11
			}
			setIsFullscreen(false);
		}
	};

	const exitFullscreen = () => {
		if (isFullscreen) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if ((document as any).webkitExitFullscreen) {
				(document as any).webkitExitFullscreen();
			} else if ((document as any).msExitFullscreen) {
				(document as any).msExitFullscreen();
			}
			setIsFullscreen(false);
		}
	};

	return { isFullscreen, toggleFullscreen, exitFullscreen };
};

export default useFullscreen;
