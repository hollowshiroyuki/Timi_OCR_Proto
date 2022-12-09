import { createWorker } from "tesseract.js";
import { SingleBar, Presets } from "cli-progress";
import fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';
const Upscaler = require('upscaler/node');

(async () => {
  const upscaler = new Upscaler();
  const recognizeBar = new SingleBar({}, Presets.shades_classic);
  const worker = await createWorker({
    logger: m => recognizeBar.update(m.progress)
  });


  const file = process.argv[2] || "";
  const lang = 'fra';

  console.log(`Opening ${file}`)
  const image = tf.node.decodeImage(fs.readFileSync(file), 3);
  const upscaledTensor = await upscaler.upscale(image, {
    output: 'tensor',
  });
  const upscaledImage = await tf.node.encodePng(upscaledTensor);
  fs.writeFileSync('output.png', upscaledImage);

  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  recognizeBar.start(1.0, 0)
  const { data: { text } } = await worker.recognize('output.png');
  recognizeBar.stop();
  console.log(text);
  await worker.terminate();
})();
