import { globalSoundVars } from "../../components/MainComponent";

const scriptProcessorAPI = async (vars: globalSoundVars, cb: (data: any) => void) => {
	vars.audioStream = await navigator.mediaDevices.getUserMedia({
		audio: {
			echoCancellation: true,
			noiseSuppression: true,
		},
	});
	vars.audioContext = new AudioContext();
	const source = vars.audioContext.createMediaStreamSource(vars.audioStream);
	vars.soundApiNode = vars.audioContext.createScriptProcessor(256, 1, 1);

	source.connect(vars.soundApiNode);
	vars.soundApiNode.connect(vars.audioContext.destination);

	vars.soundApiNode.onaudioprocess = (event) => {
		const audioData = event.inputBuffer.getChannelData(0);
		cb(audioData);
	};
};

export default scriptProcessorAPI;
