const test = require('tape');
const { isRenavam } = require('../dist/documents');
const { fake, mask } = require('../dist/documents/renavam');

test('Renavams válidas', (t) => {
  const valid = [
    '19525197703',
    '33940389599',
    '03607626105',
    '64090416160',
    '80499688374',
    '40650543741',
    '67747331627',
    '00839172788',
    '14283256656',
    '95059845976',
    '01048155258', // bros
  ];

  valid.forEach((key) => {
    t.true(isRenavam(key), `Renavam ${key} deve ser válida`);
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

test('Gera renavams aleatórias e testa se estão corretas', (t) => {
  for (let i = 0; i < 10; i += 1) {
    const renavam = fake();
    t.true(isRenavam(renavam), `Renavam ${renavam} deve ser válida`);
  }

  t.end();
});

test('Testando se a máscara foi gerada corretamente', (t) => {
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
