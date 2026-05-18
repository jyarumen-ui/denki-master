const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'tools');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function wikimediaUrl(filename, width = 300) {
  const md5 = crypto.createHash('md5').update(filename).digest('hex');
  const h1 = md5[0];
  const h12 = md5.slice(0, 2);
  const enc = encodeURIComponent(filename);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h1}/${h12}/${enc}/${width}px-${enc}`;
}

const TOOLS = [
  { id: 't01', file: 'Lineman%27s_pliers.jpg' },
  { id: 't02', file: 'Crimping_tool.jpg' },
  { id: 't03', file: 'Diagonal_pliers.jpg' },
  { id: 't04', file: 'Tongue-and-groove_pliers.jpg' },
  { id: 't05', file: 'Utility_knife_box_cutter.jpg' },
  { id: 't06', file: 'Wire_stripper.jpg' },
  { id: 't07', file: 'Tape_measure.jpg' },
  { id: 't08', file: 'Screwdriver_pozidrive.jpg' },
  { id: 't09', file: 'Flathead_screwdriver.jpg' },
  { id: 't10', file: 'Voltage_tester.jpg' },
  { id: 't11', file: 'Clamp_meter.jpg' },
  { id: 't12', file: 'Digital_Multimeter_Aka.jpg' },
  { id: 't13', file: 'Hole_saw.jpg' },
  { id: 't14', file: 'Conduit_bender.jpg' },
  { id: 't15', file: 'Pipe-cutter-01.jpg' },
  { id: 't16', file: 'Reamer.jpg' },
  { id: 't17', file: 'Rubber_mallet.jpg' },
  { id: 't18', file: 'Gloves.jpg' },
  { id: 't19', file: 'Safety_helmet.jpg' },
  { id: 't20', file: 'Tool_belt.jpg' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadUrl(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'DenkiStudyApp/1.0' } }, (res) => {
      if ([301,302,303,307,308].includes(res.statusCode)) {
        return downloadUrl(res.headers.location, dest, redirects+1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => { f.close(); resolve(); });
      f.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.abort(); reject(new Error('timeout')); });
  });
}

async function run() {
  console.log('Downloading tool images (Wikimedia Commons)...\n');
  const urls = {};
  let ok = 0;

  for (const tool of TOOLS) {
    const dest = path.join(dir, `${tool.id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`[SKIP] ${tool.id} already exists`);
      urls[tool.id] = tool.file;
      ok++;
      continue;
    }

    const rawFile = decodeURIComponent(tool.file);
    const url = wikimediaUrl(rawFile);
    try {
      await downloadUrl(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 2000) throw new Error(`too small (${size} bytes)`);
      console.log(`[OK]   ${tool.id} ${rawFile} → ${size} bytes`);
      urls[tool.id] = rawFile;
      ok++;
    } catch (e) {
      console.log(`[FAIL] ${tool.id} ${rawFile}: ${e.message}`);
    }
    await sleep(300);
  }

  // Write the toolImages mapping
  const lines = Object.entries(urls)
    .map(([id]) => `  ${id}: require('../../assets/tools/${id}.jpg'),`)
    .join('\n');
  const tsContent = `// Auto-generated - do not edit manually
export const TOOL_IMAGES: Record<string, any> = {\n${lines}\n};\n`;
  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'toolImages.ts'), tsContent);

  console.log(`\nDone: ${ok}/${TOOLS.length} downloaded`);
  console.log('Generated src/data/toolImages.ts');
}

run();
