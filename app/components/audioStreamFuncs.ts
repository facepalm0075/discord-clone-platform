import { isAudioWorkletSupported } from "../utils/randomFuncs/randFuncs";
import scriptProcessorAPI from "../utils/soundApis/scriptProcessorAPI";
import workLetAPI from "../utils/soundApis/workLetAPI";
import { globalSoundVars } from "./MainComponent";

export const isFireFoxBrowser = (): boolean => {
	return typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
};

export async function startREC(
	globalSoundVars: globalSoundVars,
	cbHandler: (data: Float32Array) => void,
	cbHandlerCancel: () => void,
	thresholdDb: number
) {
	if (isAudioWorkletSupported()) {
		console.log("AudioWorklet is supported!");
		const isFirefox = isFireFoxBrowser();
		isFirefox
			? scriptProcessorAPI(globalSoundVars, cbHandler)
			: workLetAPI(globalSoundVars, cbHandler, cbHandlerCancel, thresholdDb);
	} else {
		console.error("AudioWorklet is not supported in this browser.");
		scriptProcessorAPI(globalSoundVars, cbHandler);
	}

	console.log("Recording started.");
}

export function stopREC(globalSoundVars: globalSoundVars) {
	console.log("Stopping the recorder.");

	if (globalSoundVars.audioStream) {
		// Stop all tracks in the stream
		globalSoundVars.audioStream.getTracks().forEach((track) => track.stop());
		globalSoundVars.audioStream = null;
		console.log("Stopped all tracks in the stream");
	}

	if (globalSoundVars.audioContext) {
		// Close the audio context
		globalSoundVars.audioContext.close();
		globalSoundVars.audioContext = null;
		console.log("Closed the audio context");
	}

	if (globalSoundVars.soundApiNode) {
		// Disconnect the worklet node
		globalSoundVars.soundApiNode.disconnect();
		globalSoundVars.soundApiNode = null;
		console.log("The worklet node disconnected");
	}
}
