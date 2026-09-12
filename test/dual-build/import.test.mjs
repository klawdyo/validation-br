// Smoke test: consumes the built package the way an ESM project would,
// via `import ... from 'validation-br'`, resolved through the package's own
// "exports" map (self-reference resolution) instead of a relative dist path.
import assert from 'node:assert';

import { isCPF, isCNPJ } from 'validation-br';
import { CPF } from 'validation-br/cpf';

assert.strictEqual(typeof isCPF, 'function');
assert.strictEqual(typeof isCNPJ, 'function');
assert.strictEqual(typeof CPF, 'function');

const fakeCpf = CPF.fake().toString();
assert.strictEqual(isCPF(fakeCpf), true);
assert.strictEqual(isCPF('00000000000'), false);

console.log('ESM dual-build smoke test: OK');
