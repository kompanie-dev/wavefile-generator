import { BaseWaveFileGenerator } from "./baseWaveFileGenerator.js";

export class WaveFileGenerator16Bit extends BaseWaveFileGenerator {
    generate(audioBuffer) {
        return super.generateWaveFileFromAudioBuffer(audioBuffer, 16, this.#write16BitPcmSample);
    }

    #write16BitPcmSample(dataView, audioSample, sampleIndex) {
        const clippedSample = Math.max(-1, Math.min(1, audioSample));
        const finalSample = clippedSample < 0 ? clippedSample * 0x8000 : clippedSample * 0x7FFF;

        dataView.setInt16(44 + sampleIndex * 2, finalSample, true);
    }
}