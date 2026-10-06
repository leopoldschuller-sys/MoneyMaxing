// Renders one skit to build/<skit>.video.mp4 (+ build/<skit>.cues.json for the audio synth).
// Usage:
//   NODE_PATH=$(npm root -g) node render/render.js <skit> [--stills 1.5,7,12.25] [--cues] [--fps 30]
// --stills writes PNGs of single moments to build/stills/ instead of rendering the whole video.
// --cues only writes build/<skit>.cues.json (for re-doing the soundtrack without re-rendering).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
}

async function main() {
  const skit = process.argv[2];
  if (!skit) throw new Error('usage: render.js <skit> [--stills t1,t2] [--fps 30]');
  const stills = arg('--stills', null);
  fs.mkdirSync(BUILD, { recursive: true });

  const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => { console.error('[page error]', e); process.exitCode = 1; });
  await page.goto('file://' + path.join(__dirname, 'page.html') + '?skit=' + encodeURIComponent(skit));
  await page.waitForFunction(() => window.READY === true || window.LOAD_ERROR, null, { timeout: 30000 });
  const loadError = await page.evaluate(() => window.LOAD_ERROR || null);
  if (loadError) throw new Error(loadError);

  const meta = await page.evaluate(() => window.skitMeta());
  const fps = Number(arg('--fps', meta.fps || 30));
  console.log(`${skit}: ${meta.duration}s, ${meta.sfx.length} sfx, ${meta.music.length} music cues`);

  const grab = (t) => page.evaluate((tt) => window.renderFrame(tt), t);

  if (stills) {
    const dir = path.join(BUILD, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const s of stills.split(',')) {
      const t = Number(s);
      const b64 = await page.evaluate((tt) => window.renderFrame(tt, 'image/png'), t);
      const file = path.join(dir, `${skit}_${t.toFixed(2)}.png`);
      fs.writeFileSync(file, Buffer.from(b64, 'base64'));
      console.log('wrote', file);
    }
    await browser.close();
    return;
  }

  fs.writeFileSync(path.join(BUILD, `${skit}.cues.json`), JSON.stringify(meta, null, 1));
  if (process.argv.includes('--cues')) {
    await browser.close();
    return;
  }

  const out = path.join(BUILD, `${skit}.video.mp4`);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', fps > 30 ? '19' : '17', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));

  const frames = Math.round(meta.duration * fps);
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const b64 = await grab(f / fps);
    const ok = ff.stdin.write(Buffer.from(b64, 'base64'));
    if (!ok) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${skit}: frame ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  console.log(`${skit}: video done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
