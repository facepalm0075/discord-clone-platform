import { globalSoundVars } from "../../components/MainComponent";

const thresholdDb = -50;

const workLetAPI = async (
	vars: globalSoundVars,
	cb: (data: any) => void,
	cbHandlerCancel: () => void
) => {
	try {
		// Request microphone access
		vars.audioStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
			},
		});
		vars.audioContext = new AudioContext();

		// Check if Audio Worklet is available
		if (!vars.audioContext.audioWorklet) {
			console.error("Audio Worklet is not supported in this browser.");
			return;
		}

		// Load the Audio Worklet processor
		await vars.audioContext.audioWorklet.addModule("audioProcessor.js");

		// Create the worklet node
		vars.soundApiNode = new AudioWorkletNode(vars.audioContext, "audio-processor");

		// Connect media stream to the worklet
		const source = vars.audioContext.createMediaStreamSource(vars.audioStream);
		source.connect(vars.soundApiNode);
		vars.soundApiNode.connect(vars.audioContext.destination);
		vars.soundApiNode.port.postMessage({ thresholdDb });
		
		// Listen for messages from the worklet processor
		vars.soundApiNode.port.onmessage = (event) => {
			const { audioData, onStop } = event.data;
			// Send the processed audio data to the callback func
			if (onStop) {
				cbHandlerCancel();
			} else {
				cb(audioData);
			}
		};
	} catch (error) {
		console.log("cant get mic accsess");
	}
};

export default workLetAPI;
