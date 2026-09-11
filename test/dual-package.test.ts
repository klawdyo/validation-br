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
let consumerDir: string;

// Um valor válido conhecido por validador, espelhando test/index.test.ts,
// pra garantir que TODOS os validadores exportados por src/index.ts
// funcionam de ponta a ponta no pacote publicado (require e import),
// não só uma amostra.
const VALIDATORS: Record<string, string> = {
  isCNH: '69044271146',
  isCNPJ: '32432147000147',
  isCPF: '15886489070',
  isJudicialProcess: '08002732820164058400',
  isNUP17: '23037001462202165',
  isPhone: '11987654321',
  isPIS: '23795126955',
  isPostalCode: 'PN718252423BR',
  isRenavam: '80499688374',
  isTituloEleitor: '153036161686',
};

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

  // Monta um "pacote instalado" de verdade em node_modules/validation-br,
  // pra exercitar a resolução real do campo "exports" (require/import de
  // subpaths), não apenas requires/imports relativos diretos aos arquivos.
  const pkgRoot = path.join(tmpRoot, 'pkg');
  copyDir(dist, path.join(pkgRoot, 'dist'));
  const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  fs.writeFileSync(path.join(pkgRoot, 'package.json'), JSON.stringify(pkgJson));

  consumerDir = path.join(tmpRoot, 'consumer');
  const nodeModules = path.join(consumerDir, 'node_modules');
  fs.mkdirSync(nodeModules, { recursive: true });
  fs.symlinkSync(pkgRoot, path.join(nodeModules, 'validation-br'), 'dir');
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

  test.each(Object.entries(VALIDATORS))(
    'build CJS: require() carrega o pacote e %s funciona (named export e default)',
    (name, validValue) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const lib = require(cjsEntry);

      expect(typeof lib[name]).toBe('function');
      expect(typeof lib.default[name]).toBe('function');
      expect(lib[name](validValue)).toBe(true);
      expect(lib.default[name](validValue)).toBe(true);
    },
  );

  test('build CJS: require() rejeita um valor inválido', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lib = require(cjsEntry);
    expect(lib.isCPF('11111111111')).toBe(false);
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

  test('build ESM: import nativo do Node carrega o pacote e TODOS os validadores funcionam (named export e default)', () => {
    const script = `
      import * as lib from '${esmEntry.replace(/\\/g, '\\\\')}';
      const validators = ${JSON.stringify(VALIDATORS)};
      const result = {};
      for (const [name, validValue] of Object.entries(validators)) {
        result[name] = {
          named: typeof lib[name] === 'function' && lib[name](validValue),
          default: typeof lib.default[name] === 'function' && lib.default[name](validValue),
        };
      }
      result.invalidCPF = lib.isCPF('11111111111');
      process.stdout.write(JSON.stringify(result));
    `;

    const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      encoding: 'utf8',
    });

    const result = JSON.parse(stdout);
    for (const name of Object.keys(VALIDATORS)) {
      expect(result[name]).toEqual({ named: true, default: true });
    }
    expect(result.invalidCPF).toBe(false);
  });

  test('build ESM: dist/esm/package.json marca o diretório como módulo ESM', () => {
    const esmPkg = JSON.parse(fs.readFileSync(path.join(path.dirname(esmEntry), 'package.json'), 'utf8'));
    expect(esmPkg.type).toBe('module');
  });

  test('imports profundos (require): "validation-br/dist/cpf" (documentado no readme) e "validation-br/cpf" continuam funcionando', () => {
    const script = `
      const legacy = require('validation-br/dist/cpf');
      const short = require('validation-br/cpf');
      process.stdout.write(JSON.stringify({
        legacyValid: legacy.validate('15886489070'),
        shortValid: short.validate('15886489070'),
      }));
    `;

    const stdout = execFileSync(process.execPath, ['-e', script], { cwd: consumerDir, encoding: 'utf8' });

    expect(JSON.parse(stdout)).toEqual({ legacyValid: true, shortValid: true });
  });

  test('imports profundos (import nativo): "validation-br/dist/cpf" e "validation-br/cpf" continuam funcionando', () => {
    const script = `
      import * as legacy from 'validation-br/dist/cpf';
      import * as short from 'validation-br/cpf';
      process.stdout.write(JSON.stringify({
        legacyValid: legacy.validate('15886489070'),
        shortValid: short.validate('15886489070'),
      }));
    `;

    const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      cwd: consumerDir,
      encoding: 'utf8',
    });

    expect(JSON.parse(stdout)).toEqual({ legacyValid: true, shortValid: true });
  });
});
