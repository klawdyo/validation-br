import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Garante que o pacote publicado funciona tanto por `require` (CJS)
 * quanto por `import` nativo do Node (ESM), reproduzindo os mesmos
 * passos do publish.sh (build duplo + cópia + normalização dos
 * imports relativos do ESM), mas num diretório temporário para não
 * mexer no ./dist real do projeto.
 */

jest.setTimeout(60000);

/**
 * O tsconfig.json principal inclui "./test/**\/*", então o build de CJS
 * também compila este arquivo para output/test/dual-package.test.js, e
 * o Jest (sem roots/testPathIgnorePatterns configurados neste projeto)
 * acaba executando essa cópia também, a partir de um __dirname um nível
 * mais fundo. Por isso a raiz do projeto é localizada subindo os
 * diretórios até achar o tsconfig.esm.json, em vez de assumir "..".
 */
function findProjectRoot(startDir: string): string {
  let dir = startDir;
  while (!fs.existsSync(path.join(dir, 'tsconfig.esm.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('Não foi possível localizar a raiz do projeto (tsconfig.esm.json não encontrado)');
    }
    dir = parent;
  }
  return dir;
}

const ROOT = findProjectRoot(__dirname);
const TSC_BIN = require.resolve('typescript/bin/tsc');

let tmpRoot: string;
let cjsEntry: string;
let esmEntry: string;

function run(args: string[]) {
  execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'pipe' });
}

function copyDir(from: string, to: string) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

beforeAll(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-br-dual-package-'));
  const cjsOut = path.join(tmpRoot, 'cjs-out');
  const esmOut = path.join(tmpRoot, 'esm-out');
  const dist = path.join(tmpRoot, 'dist');
  const distEsm = path.join(dist, 'esm');

  fs.mkdirSync(distEsm, { recursive: true });

  // Build CJS (usa o tsconfig.json base, sem rootDir explícito, então
  // emite dentro de <outDir>/src/*)
  run([TSC_BIN, '--outDir', cjsOut]);

  // Build ESM (tsconfig.esm.json, com rootDir "./src", emite direto em <outDir>/*)
  run([TSC_BIN, '-p', 'tsconfig.esm.json', '--outDir', esmOut]);

  // Reproduz os passos de cópia do publish.sh
  copyDir(path.join(cjsOut, 'src'), dist);
  copyDir(esmOut, distEsm);

  // Reproduz a normalização de extensões do publish.sh
  run([path.join(ROOT, 'scripts', 'fix-esm-extensions.js'), distEsm]);

  fs.writeFileSync(path.join(distEsm, 'package.json'), JSON.stringify({ type: 'module' }));

  cjsEntry = path.join(dist, 'index.js');
  esmEntry = path.join(distEsm, 'index.js');
});

afterAll(() => {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe('pacote publicado (dual CJS/ESM)', () => {
  test('package.json declara main/module/exports coerentes com a estrutura CJS+ESM', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

    expect(pkg.main).toBe('dist/index.js');
    expect(pkg.module).toBe('dist/esm/index.js');
    expect(pkg.exports['.'].require).toBe('./dist/index.js');
    expect(pkg.exports['.'].import).toBe('./dist/esm/index.js');
  });

  test('build CJS: require() carrega o pacote e os validadores funcionam', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lib = require(cjsEntry);

    expect(typeof lib.isCPF).toBe('function');
    expect(typeof lib.isCNPJ).toBe('function');
    expect(typeof lib.default.isCPF).toBe('function');

    expect(lib.isCPF('15886489070')).toBe(true);
    expect(lib.isCPF('11111111111')).toBe(false);
    expect(lib.isCNPJ('32432147000147')).toBe(true);
  });

  test('build ESM: nenhum import relativo fica sem extensão .js (quebraria o resolvedor nativo do Node)', () => {
    const esmDir = path.dirname(esmEntry);
    const files = fs.readdirSync(esmDir).filter((f) => f.endsWith('.js'));
    const specifierRe = /from\s+['"](\.[^'"]+)['"]/g;
    const bareSpecifiers: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(esmDir, file), 'utf8');
      for (const match of content.matchAll(specifierRe)) {
        const specifier = match[1];
        if (!specifier.endsWith('.js')) bareSpecifiers.push(`${file}: ${specifier}`);
      }
    }

    expect(bareSpecifiers).toEqual([]);
  });

  test('build ESM: import nativo do Node carrega o pacote e os validadores funcionam', () => {
    const script = `
      import * as lib from '${esmEntry.replace(/\\/g, '\\\\')}';
      const result = {
        hasIsCPF: typeof lib.isCPF === 'function',
        hasDefaultIsCPF: typeof lib.default?.isCPF === 'function',
        validCPF: lib.isCPF('15886489070'),
        invalidCPF: lib.isCPF('11111111111'),
        validCNPJ: lib.isCNPJ('32432147000147'),
      };
      process.stdout.write(JSON.stringify(result));
    `;

    const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      encoding: 'utf8',
    });

    expect(JSON.parse(stdout)).toEqual({
      hasIsCPF: true,
      hasDefaultIsCPF: true,
      validCPF: true,
      invalidCPF: false,
      validCNPJ: true,
    });
  });

  test('build ESM: dist/esm/package.json marca o diretório como módulo ESM', () => {
    const esmPkg = JSON.parse(fs.readFileSync(path.join(path.dirname(esmEntry), 'package.json'), 'utf8'));
    expect(esmPkg.type).toBe('module');
  });
});
