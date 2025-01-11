import { useAudioPlayer } from "./usePlayAudio";

export const useJnDplayer = () => {
	const s1 = useAudioPlayer("/djs.mp3");
	const s0 = useAudioPlayer("/dds.mp3");

	const playJoinSound = () => {
		s1.playAudio();
	};
	const playDisconnectSound = () => {
		s0.playAudio();
	};

	return [playJoinSound, playDisconnectSound];
};
