import { BaseWaveFileGenerator } from "./baseWaveFileGenerator.js";

export class WaveFileGenerator32Bit extends BaseWaveFileGenerator {
    generate(audioBuffer) {
        return super.generateWaveFileFromAudioBuffer(audioBuffer, 32, this.#write32BitFloatSample);
    }

    #write32BitFloatSample(dataView, audioSample, sampleIndex) {
        dataView.setFloat32(44 + sampleIndex * 4, audioSample, true);
    }
}