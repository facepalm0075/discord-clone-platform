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

export default function presistState(name: string) {
	const getLocalState = (defualt: number) => {
		if (typeof window !== "undefined") {
			const local = localStorage.getItem(name);
			if (local) {
				return JSON.parse(local) as number;
			}
		}
		return defualt;
	};

	const localStateSaver = (state: number) => {
		if (typeof window !== "undefined") {
			localStorage.setItem(name, JSON.stringify(state));
		}
	};

	return { getLocalState, localStateSaver };
}
