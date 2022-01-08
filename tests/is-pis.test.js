const test = require('tape');
const { isPIS } = require('../dist/documents');

const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/pis-pasep');

test('isPIS() - PIS válidos', (t) => {
  [
    // string
    '71282677380',
    '23795126955',
    // integer
    50012973803,
    27890141144,
    // masked
    '268.27649.96-0',
    '613.01862.91-7',
  ].forEach((key) => {
    t.true(isPIS(key), `PIS ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - PIS válidos', (t) => {
  [
    // string
    '71282677380',
    '23795126955',
    // integer
    50012973803,
    27890141144,
    // masked
    '268.27649.96-0',
    '613.01862.91-7',
  ].forEach((key) => {
    t.true(validate(key), `PIS ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - PIS inválidos', (t) => {
  [
    '712.82677.38-2',
    '237.95126.95-4',
    '500.12973.80-1',
    '278.90141.14-9',
    '268.27649.96-2',
    '613.01862.91-4',
    '111.11111.11-1',
  ].forEach((key) => {
    t.false(validate(key), `PIS ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - PIS inválidos', (t) => {
  [
    '712.82677.38-2',
    '237.95126.95-4',
    '500.12973.80-1',
    '278.90141.14-9',
    '268.27649.96-2',
    '613.01862.91-4',
    '111.11111.11-1',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `PIS ${key} deve retornar exceção`);
  });

  t.end();
});

test('PIS não informado', (t) => {
  t.false(isPIS(''), 'PIS vazio deve retornar false');
  t.false(validate(''), 'PIS vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'PIS vazio deve lançar exceção');
  t.end();
});

test('fake() - Gera PISs fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const pis = fake();

    t.true(validate(pis),
      `PIS fake ${pis} deve ser válido`);
    t.assert(pis.length === 11,
      `PIS ${pis} precisa ter 11 caracteres`);
  }

  t.end();
});

test('fake() - Gera PISs fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const pis = fake(true);

    t.true(validate(pis), `PIS fake ${pis} deve ser válido`);
    t.assert(pis.length === 14,
      `PIS ${pis} precisa ter 14 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: '7128267738', expected: '0' },
    { num: 2379512695, expected: '5' },
    { num: '5001297380', expected: '3' },
  ].forEach((item) => {
    const calcDV = dv(item.num);

    t.equal(calcDV, item.expected,
      `${item.num} deve gerar um DV igual a ${item.expected}`);

    t.assert(typeof calcDV === 'string', `O DV ${item.expected} precisa ser uma string`);
    t.assert(calcDV.length === 1, `O DV ${item.expected} precisa ter 1 caracteres`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { num: '71282677380', expected: '712.82677.38-0' },
    { num: 23795126955, expected: '237.95126.95-5' },
    { num: '50012973803', expected: '500.12973.80-3' },
  ].forEach((item) => {
    const masked = mask(item.num);

    t.equal(masked, item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);

    t.assert(masked.length === 14, `O PIS ${item.expected} precisa ter 14 caracteres com máscara`);
  });

  t.end();
});
