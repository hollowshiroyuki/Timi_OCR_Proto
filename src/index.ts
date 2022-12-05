import { createWorker } from "tesseract.js";
import { SingleBar, Presets } from "cli-progress";
// import Upscaler from "upscaler";

(async () => {
  // const upscaler = new Upscaler(/*{ scale: 2 }*/);
  const recognizeBar = new SingleBar({}, Presets.shades_classic);
  const worker = await createWorker({
    logger: m => recognizeBar.update(m.progress)
  });


  const file = process.argv[2] || "";
  const lang = 'fra';

  // console.log(`Opening ${file}`)
  // const image = await upscaler.upscale(file);
  const image = file;
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  recognizeBar.start(1.0, 0)
  const { data: { text } } = await worker.recognize(image);
  recognizeBar.stop();
  console.log(text);
  await worker.terminate();
})();
