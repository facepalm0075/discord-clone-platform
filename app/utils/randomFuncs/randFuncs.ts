import { nameType } from "@/app/components/MainComponent";

export function isAudioWorkletSupported(): boolean {
	try {
		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		return !!audioContext.audioWorklet;
	} catch (error) {
		console.error("Error while checking AudioWorklet support:", error);
		return false;
	}
}

export function appendArrays(chunks: any[], totalSize: number): Float32Array {
	const result = new Float32Array(totalSize);
	let offset = 0;

	chunks.forEach((chunk) => {
		const temp = new Float32Array(chunk);
		result.set(temp, offset);
		offset += temp.length;
	});

	return result;
}

export const getSampleRate = (): number => {
	const constest = new AudioContext();
	const rate = constest.sampleRate;
	constest.close();
	return rate;
};

export const getUserName = (): nameType => {
	let data = JSON.parse(localStorage.getItem("name")!);

	return data;
};
