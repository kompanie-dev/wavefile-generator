# Wavefile Generator

A JavaScript-based generator for 16 and 32 bit .wav files.
It takes a `mono` or `stereo` [Web Audio AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) as input and generates an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the wave file.

## Usage

At first you need to install the package using the following command:
```
npm i @kompanie/wavefile-generator
```

```js
import { WaveFileGenerator16Bit, WaveFileGenerator32Bit } from "@kompanie/wavefile-generator";

// For generating 16 Bit WAV files
const waveFileGenerator = new WaveFileGenerator16Bit();

// For generating 32 Bit WAV files
const waveFileGenerator = new WaveFileGenerator32Bit();

const arrayBuffer = waveFileGenerator.generate(audioBuffer);
```

## Getting Started

Execute `npm install` and then use `npm start` to run the demo project.

The site will be available at [localhost:8000](http://localhost:8000).