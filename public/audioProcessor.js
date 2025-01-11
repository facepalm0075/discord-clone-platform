class AudioProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
		this.thresholdDb = -60; // Default threshold in dB
		this.timer = 0;
		this.stoped = true;
		this.stopTime = 200;

		// Listen for messages from the main thread
		this.port.onmessage = (event) => {
			if (event.data && event.data.thresholdDb !== undefined) {
				this.thresholdDb = event.data.thresholdDb;
			}
			if (event.data && event.data.stopTime !== undefined) {
				this.stopTime = event.data.stopTime;
			}
		};
	}

	process(inputs) {
		let input = inputs[0]; // Get the first input channel

		// Handle empty input gracefully
		if (!input || input.length === 0) {
			return true; // Keep the processor alive
		}

		const audioData = input[0]; // Access the audio data (first channel)

		// Compute RMS of the audio data
		const sum = audioData.reduce((acc, sample) => acc + sample ** 2, 0);
		const rms = Math.sqrt(sum / audioData.length);

		// Convert RMS to dB
		const db = rms > 0 ? 20 * Math.log10(rms) : -Infinity;

		// Post audio data only if above the threshold
		if (db > this.thresholdDb) {
			this.timer = 0;
			this.stoped = false;
			this.port.postMessage({ audioData, onStop: false });
		} else {
			if (this.timer < this.stopTime) {
				this.timer += 1;
				this.port.postMessage({ audioData, onStop: false });
			} else {
				if (!this.stoped) {
					this.stoped = true;
					this.port.postMessage({ audioData, onStop: true });
				}
			}
		}

		return true; // Keep the processor alive
	}
}

registerProcessor("audio-processor", AudioProcessor);
