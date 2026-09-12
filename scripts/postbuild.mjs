import { writeFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { cwd } from 'node:process';

writeFileSync(
  join(cwd(), 'dist/cjs/package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
);

writeFileSync(
  join(cwd(), 'dist/esm/package.json'),
  JSON.stringify({ type: 'module' }, null, 2) + '\n'
);

// Node's ESM loader requires explicit file extensions on relative
// specifiers, but tsc emits extension-less ones. All relative imports here
// resolve to plain files (no subdirectory index imports), so appending
// '.js' to any extension-less relative specifier is safe.
function addJsExtensions(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      addJsExtensions(path);
      continue;
    }
    if (extname(path) !== '.js') continue;

    const source = readFileSync(path, 'utf-8');
    const fixed = source.replace(
      /(from\s+['"]|import\s*\(\s*['"]|import\s+['"])(\.\.?(?:\/[^'"]*)?)(['"])/g,
      (match, prefix, specifier, suffix) => {
        if (specifier === '.' || specifier === './') specifier = './index';
        else if (specifier === '..' || specifier === '../')
          specifier = '../index';
        return extname(specifier)
          ? `${prefix}${specifier}${suffix}`
          : `${prefix}${specifier}.js${suffix}`;
      }
    );

    if (fixed !== source) writeFileSync(path, fixed);
  }
}

addJsExtensions(join(cwd(), 'dist/esm'));
