const test = require('tape');
const { isRenavam } = require('../dist/documents');
const {
  fake, mask, validate, dv,
} = require('../dist/documents/renavam');

test('isRenavam() - Renavams válidas', (t) => {
  const valid = [
    // valores com máscara
    '1952519770-3',
    '3394038959-9',
    // valores como inteiros
    3607626105,
    64090416160,
    // valores como string sem máscara
    '80499688374',
    '40650543741',
  ];

  valid.forEach((key) => {
    t.true(isRenavam(key), `Renavam ${key} deve ser válida`);
  });

  t.end();
});

test('validate() - Renavams válidas', (t) => {
  const valid = [
    // valores com máscara
    '1952519770-3',
    '3394038959-9',
    // valores como inteiros
    3607626105,
    64090416160,
    // valores como string sem máscara
    '80499688374',
    '40650543741',
  ];

  valid.forEach((key) => {
    t.true(validate(key), `Renavam ${key} deve ser válida`);
  });

  t.end();
});

test('Renavams inválidas', (t) => {
  const invalid = [
    '19525227703',
    '33940229599',
    '03607226105',
    '64090226160',
    '80499228374',
  ];

  invalid.forEach((key) => {
    t.false(isRenavam(key), `Renavam ${key} deve ser inválida`);
  });

  t.end();
});

test('validateOrFail() - Renavams inválidas devem lançar exceção', (t) => {
  const invalid = [
    '19525227703',
    '33940229599',
    '03607226105',
    '64090226160',
    '80499228374',
  ];

  invalid.forEach((key) => {
    t.false(isRenavam(key), `Renavam ${key} deve ser inválida`);
  });

  t.end();
});

test('fake() - Gera renavams aleatórias e testa se estão corretas', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const renavam = fake();
    t.true(isRenavam(renavam), `Renavam ${renavam} deve ser válida`);
    t.assert(renavam.length === 11, `Renavam ${renavam} deve ter 11 caracteres`);
  }

  for (let i = 0; i < 5; i += 1) {
    const renavam = fake(true);
    t.true(isRenavam(renavam), `Renavam ${renavam} deve ser válida`);
    t.assert(renavam.length === 12, `Renavam ${renavam} deve ter 12 caracteres`);
  }

  t.end();
});

test('dv() - Verificando se o DV gerado está correto', (t) => {
  const dvs = {
    1952519770: 3,
    952519770: 6,
    52519770: 2,
  };

  Object.keys(dvs).forEach((num) => {
    t.equal(dv(num), dvs[num], `${num} com máscara precisa ser igual a ${dvs[num]}`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  const maskedValues = {
    19525197703: '1952519770-3',
    9525197703: '0952519770-3',
    525197703: '0052519770-3',
  };

  Object.keys(maskedValues).forEach((key) => {
    t.equal(mask(key), maskedValues[key], `${key} com máscara precisa ser igual a ${maskedValues[key]}`);
  });

  t.end();
});
