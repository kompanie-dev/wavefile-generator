export class BaseWaveFileGenerator {
    generateWaveFileFromAudioBuffer(audioBuffer, bitDepth, audioSampleWriter) {
        const audioSamples = this.#convertAudioBufferToFloat32Array(audioBuffer);
        const outputBuffer = new ArrayBuffer(44 + audioSamples.length * bitDepth / 8);
        const dataView = new DataView(outputBuffer);
      
        this.#writeFileHeaderToDataView(dataView, audioSamples.length, bitDepth, audioBuffer);

        for (let i = 0; i < audioSamples.length; i++) {
            audioSampleWriter(dataView, audioSamples[i], i);
        }

        return outputBuffer;
    }

    #convertAudioBufferToFloat32Array(audioBuffer) {
        if (audioBuffer.numberOfChannels === 1) {
            return audioBuffer.getChannelData(0);
        }
        if (audioBuffer.numberOfChannels === 2) {
            return this.#interleaveStereoChannels(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));
        }

        throw Error(`Unsupported numberOfChannels of ${audioBuffer.numberOfChannels}`);
    }

    #interleaveStereoChannels(leftChannel, rightChannel) {
        const interleavedArray = new Float32Array(leftChannel.length + rightChannel.length);

        for (let i = 0; i !== interleavedArray.length; i += 2) {
            interleavedArray[i    ] = leftChannel[i / 2];
            interleavedArray[i + 1] = rightChannel[i / 2 + 1];
        }

        return interleavedArray;
    }

    #writeFileHeaderToDataView(dataView, audioDataLength, bitDepth, audioBuffer) {
        // For more info about the header: https://ccrma.stanford.edu/courses/422-winter-2014/projects/WaveFormat/
        const bytesPerSample = bitDepth / 8;
        const format = bitDepth === 32 ? 3 : 1;

        // RIFF CHUNK DESCRIPTOR
        dataView.setUint16(0, 0x5249); // ChunkID Byte 1 (RI)
        dataView.setUint16(2, 0x4646); // ChunkID Byte 2 (FF)
        dataView.setUint32(4, 36 + audioDataLength * bytesPerSample, true); // ChunkSize (file size)
        dataView.setUint16(8, 0x5741); // Format Byte 1 (WA)
        dataView.setUint16(10, 0x5645); // Format Byte 2 (VE)

        // FORMAT SUBCHUNK
        dataView.setUint16(12, 0x666d); // Subchunk1ID Byte 1 (fm)
        dataView.setUint16(14, 0x7420); // Subchunk1ID Byte 2 (t )
        dataView.setUint32(16, 16, true); // Subchunk1Size (size of the rest of the subchunk which follows after this number)
        dataView.setUint16(20, format, true); // AudioFormat (float=3 or PCM=1)
        dataView.setUint16(22, audioBuffer.numberOfChannels, true); // NumberOfChannels (1 for mono or 2 for stereo)
        dataView.setUint32(24, audioBuffer.sampleRate, true); // SampleRate (44100, 48000 etc.)
        dataView.setUint32(28, audioBuffer.sampleRate * audioBuffer.numberOfChannels * bytesPerSample, true); // ByteRate
        dataView.setUint16(32, audioBuffer.numberOfChannels * bytesPerSample, true); // BlockAlign (number of bytes for one sample)
        dataView.setUint16(34, bitDepth, true); // BitsPerSample (16, 24 or 32)

        // DATA SUBCHUNK
        dataView.setUint16(36, 0x6461); // Subchunk2ID Byte 1 (da)
        dataView.setUint16(38, 0x7461); // Subchunk2ID Byte 2 (ta)
        dataView.setUint32(40, audioDataLength * bytesPerSample, true); // Subchunk2Size (data subchunk length)
    }
}