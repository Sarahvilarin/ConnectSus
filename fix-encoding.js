/**
 * Fix mojibake (double-encoding) in JS/JSX source files.
 * The files were saved as UTF-8 but contain text that was originally
 * read as latin-1 then re-encoded as UTF-8, producing sequences like:
 *   'ç' (U+00E7, UTF-8: C3 A7) -> read as latin-1 chars 'Ã§' -> re-encoded as UTF-8: C3 83 C2 A7
 * But in this project the bytes are already valid UTF-8 containing the
 * mojibake string literals (e.g., the 4 chars: Ã, ƒ, Â, §).
 *
 * Wait — after investigation, the files ARE valid UTF-8 and contain the
 * mojibake as actual character sequences. The fix is a simple string replacement.
 */
const fs = require('fs');
const path = require('path');

// Map of mojibake -> correct Portuguese character
// These are the actual Unicode character sequences found in the files
const FIXES = [
  // Lowercase accented
  ['\u00C3\u00A9', '\u00E9'], // é -> é
  ['\u00C3\u00A3', '\u00E3'], // ã -> ã
  ['\u00C3\u00A7', '\u00E7'], // ç -> ç
  ['\u00C3\u00A1', '\u00E1'], // á -> á
  ['\u00C3\u00BA', '\u00FA'], // ú -> ú
  ['\u00C3\u00B3', '\u00F3'], // ó -> ó
  ['\u00C3\u00AA', '\u00EA'], // ê -> ê
  ['\u00C3\u00B4', '\u00F4'], // ô -> ô
  ['\u00C3\u00AD', '\u00ED'], // í -> í
  ['\u00C3\u00B5', '\u00F5'], // õ -> õ
  ['\u00C3\u00B6', '\u00F6'], // ö -> ö
  ['\u00C3\u00BC', '\u00FC'], // ü -> ü
  ['\u00C3\u00A2', '\u00E2'], // â -> â
  ['\u00C3\u00A0', '\u00E0'], // à -> à
  ['\u00C3\u00B2', '\u00F2'], // ò -> ò
  ['\u00C3\u00B9', '\u00F9'], // ù -> ù
  ['\u00C3\u00BB', '\u00FB'], // û -> û
  ['\u00C3\u00A8', '\u00E8'], // è -> è
  ['\u00C3\u00AB', '\u00EB'], // ë -> ë
  ['\u00C3\u00AF', '\u00EF'], // ï -> ï
  ['\u00C3\u00AE', '\u00EE'], // î -> î
  ['\u00C3\u00B1', '\u00F1'], // ñ -> ñ
  // Uppercase accented
  ['\u00C3\u0081', '\u00C1'], // Á -> Á
  ['\u00C3\u0089', '\u00C9'], // É -> É
  ['\u00C3\u009A', '\u00DA'], // Ú -> Ú
  ['\u00C3\u0093', '\u00D3'], // Ó -> Ó
  ['\u00C3\u0087', '\u00C7'], // Ç -> Ç
  ['\u00C3\u0083', '\u00C3'], // Ã -> Ã
  ['\u00C3\u0095', '\u00D5'], // Õ -> Õ
  ['\u00C3\u0094', '\u00D4'], // Ô -> Ô
  ['\u00C3\u008A', '\u00CA'], // Ê -> Ê
  ['\u00C3\u009C', '\u00DC'], // Ü -> Ü
  // Special chars
  ['\u00C2\u00B0', '\u00B0'], // ° -> °
  ['\u00C2\u00BA', '\u00BA'], // º -> º
  ['\u00C2\u00AA', '\u00AA'], // ª -> ª
  ['\u00C2\u00B4', '\u00B4'], // ´ -> ´
];

// Sort by length descending to avoid partial matches
FIXES.sort((a, b) => b[0].length - a[0].length);

function fixMojibake(content) {
  let fixed = content;
  for (const [bad, good] of FIXES) {
    if (fixed.includes(bad)) {
      fixed = fixed.split(bad).join(good);
    }
  }
  return fixed;
}

function hasMojibake(content) {
  for (const [bad] of FIXES) {
    if (content.includes(bad)) return true;
  }
  return false;
}

function processDir(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error('Cannot read dir:', dir, e.message);
    return;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
        processDir(fullPath);
      }
    } else if (entry.isFile() && /\.(jsx|js|ts|tsx|css|html|md|json)$/.test(entry.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!hasMojibake(content)) continue;
        const fixed = fixMojibake(content);
        if (fixed !== content) {
          fs.writeFileSync(fullPath, fixed, 'utf8');
          console.log('FIXED:', fullPath);
        }
      } catch (e) {
        console.error('ERROR:', fullPath, e.message);
      }
    }
  }
}

const dirs = [
  'C:/Users/25170207/Documents/ConnectSus/frontend/src',
  'C:/Users/25170207/Documents/ConnectSus/backend/src',
];

for (const dir of dirs) {
  console.log('Scanning:', dir);
  processDir(dir);
}
console.log('Done.');
