const test = require('tape');
const { isRenavam } = require('../dist/documents');
const {
  fake, mask, validate, dv, validateOrFail,
} = require('../dist/documents/renavam');

test('isRenavam() - Renavams válidas', (t) => {
  [
    // valores com máscara
    '1952519770-3',
    '3394038959-9',
    // valores como inteiros
    3607626105,
    64090416160,
    // valores como string sem máscara
    '80499688374',
    '40650543741',
  ].forEach((key) => {
    t.true(isRenavam(key), `Renavam ${key} deve ser válida`);
  });

  t.end();
});

test('validate() - Renavams válidas', (t) => {
  [
    // valores com máscara
    '1952519770-3',
    '3394038959-9',
    // valores como inteiros
    3607626105,
    64090416160,
    // valores como string sem máscara
    '80499688374',
    '40650543741',
  ].forEach((key) => {
    t.true(validate(key), `Renavam ${key} deve ser válida`);
  });

  t.end();
});

test('validate() - Renavams inválidas', (t) => {
  [
    '19525227703',
    '33940229599',
    '03607226105',
    '64090226160',
    '80499228374',
  ].forEach((key) => {
    t.false(validate(key), `Renavam ${key} deve ser inválida`);
  });

  t.end();
});

test('validateOrFail() - Renavams inválidas', (t) => {
  [
    '19525227703',
    '33940229599',
    '03607226105',
    '64090226160',
    '80499228374',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `Renavam ${key} deve ser inválida`);
  });

  t.end();
});

test('fake() - Gera RENAVAMs sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const renavam = fake();

    t.true(isRenavam(renavam), `Renavam ${renavam} deve ser válida`);
    t.assert(renavam.length === 11, `Renavam ${renavam} deve ter 11 caracteres`);
  }

  t.end();
});

test('fake() - Gera RENAVAMs com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const renavam = fake(true);

    t.true(isRenavam(renavam), `Renavam ${renavam} deve ser válida`);
    t.assert(renavam.length === 12, `Renavam ${renavam} deve ter 12 caracteres`);
  }

  t.end();
});

test('dv() - Verificando se o DV gerado está correto', (t) => {
  [
    { num: '1952519770', expected: 3 },
    { num: 952519770, expected: 6 },
    { num: 52519770, expected: 2 },
  ].forEach((item) => {
    t.equal(dv(item.num), item.expected, `${item.num} com máscara precisa ser igual a ${item.expected}`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { num: '19525197703', expected: '1952519770-3' },
    { num: 9525197703, expected: '0952519770-3' },
    { num: 525197703, expected: '0052519770-3' },
  ].forEach((item) => {
    t.equal(mask(item.num), item.expected, `${item.num} com máscara precisa ser igual a ${item.expected}`);
  });

  t.end();
});
