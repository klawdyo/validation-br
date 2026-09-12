// Smoke test: consumes the built package the way a CommonJS project would,
// via `require('validation-br')`, resolved through the package's own
// "exports" map (self-reference resolution) instead of a relative dist path.
const assert = require('node:assert');

const { isCPF, isCNPJ } = require('validation-br');
const { CPF } = require('validation-br/cpf');

assert.strictEqual(typeof isCPF, 'function');
assert.strictEqual(typeof isCNPJ, 'function');
assert.strictEqual(typeof CPF, 'function');

const fakeCpf = CPF.fake().toString();
assert.strictEqual(isCPF(fakeCpf), true);
assert.strictEqual(isCPF('00000000000'), false);

console.log('CJS dual-build smoke test: OK');
