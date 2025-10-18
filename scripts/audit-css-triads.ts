import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'components'];
const CSS_SUFFIXES = ['.module.css', '.light.module.css', '.dark.module.css'];

function isTSX(file: string) {
  return file.endsWith('.tsx');
}

function shouldSkipDir(dirName: string) {
  const skips = ['node_modules', '.next', 'public', 'test', 'tests', '__tests__', '.git', 'supabase', 'scripts'];
  return skips.includes(dirName);
}

function walk(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      files = walk(full, files);
    } else if (isTSX(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function toModuleTriadPaths(tsxPath: string) {
  const dir = path.dirname(tsxPath);
  const base = path.basename(tsxPath, '.tsx');
  return CSS_SUFFIXES.map(sfx => path.join(dir, `${base}${sfx}`));
}

function ensureDir(p: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function writeIfMissing(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    ensureDir(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function starterCSS(moduleName: string) {
  return `/* ${moduleName}: Glassmorphism starter */
:root {}

.root {
  /* Attach this class to a top-level container when wiring modules */
}
`;
}

function lightCSS(moduleName: string) {
  return `/* ${moduleName} (light theme) */
:root {}

.root {}
`;
}

function darkCSS(moduleName: string) {
  return `/* ${moduleName} (dark theme) */
:root {}

.root {}
`;
}

function routeFromAppPath(p: string) {
  const rel = path.relative(path.join(ROOT, 'app'), p);
  if (rel.startsWith('..')) return null;
  const segs = rel.split(path.sep).slice(0, -1); // exclude filename
  const filtered = segs.filter(s => !(s.startsWith('(') && s.endsWith(')')));
  if (filtered.length === 0) return '/';
  return '/' + filtered.join('/');
}

interface ReportItem {
  tsx: string;
  triad: { base: boolean; light: boolean; dark: boolean };
  created: string[];
  route?: string | null;
}

function run(write: boolean) {
  const report: ReportItem[] = [];
  for (const target of TARGET_DIRS) {
    const abs = path.join(ROOT, target);
    if (!fs.existsSync(abs)) continue;
    const files = walk(abs);
    for (const f of files) {
      const [basePath, lightPath, darkPath] = toModuleTriadPaths(f);
      const triad = {
        base: fs.existsSync(basePath),
        light: fs.existsSync(lightPath),
        dark: fs.existsSync(darkPath),
      };
      const created: string[] = [];
      if (write) {
        if (!triad.base) {
          if (writeIfMissing(basePath, starterCSS(path.basename(basePath)))) created.push(path.relative(ROOT, basePath));
        }
        if (!triad.light) {
          if (writeIfMissing(lightPath, lightCSS(path.basename(lightPath)))) created.push(path.relative(ROOT, lightPath));
        }
        if (!triad.dark) {
          if (writeIfMissing(darkPath, darkCSS(path.basename(darkPath)))) created.push(path.relative(ROOT, darkPath));
        }
      }
      report.push({ tsx: path.relative(ROOT, f), triad, created, route: routeFromAppPath(f) });
    }
  }
  return report;
}

function toMarkdown(report: ReportItem[]) {
  const total = report.length;
  const compliant = report.filter(r => r.triad.base && r.triad.light && r.triad.dark).length;
  const missing = total - compliant;
  const lines: string[] = [];
  lines.push(`# CSS Module Triad Audit`);
  lines.push(`Date: ${new Date().toISOString()}`);
  lines.push(`\n- Total TSX files: ${total}`);
  lines.push(`- Fully compliant: ${compliant}`);
  lines.push(`- Missing triads: ${missing}`);
  lines.push(`\n## Details`);
  for (const item of report) {
    const status = item.triad.base && item.triad.light && item.triad.dark ? 'OK' : 'MISSING';
    const miss: string[] = [];
    if (!item.triad.base) miss.push('base');
    if (!item.triad.light) miss.push('light');
    if (!item.triad.dark) miss.push('dark');
    lines.push(`- ${item.tsx} — ${status}${miss.length ? ` (${miss.join(', ')})` : ''}${item.route ? ` — route: ${item.route}` : ''}`);
    if (item.created.length) lines.push(`  - created: ${item.created.join(', ')}`);
  }
  return lines.join('\n');
}

const write = process.argv.includes('--write');
const report = run(write);
const md = toMarkdown(report);
const outDir = path.join(ROOT, 'reports');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `css-triad-audit_${Date.now()}.md`);
fs.writeFileSync(outFile, md, 'utf8');
console.log(outFile);
