const test = require('tape');
const { isRenavam } = require('../dist/documents');

test('Renavams válidas', (t) => {
  const valid = [
    '19525197703',
    '33940389599',
    '03607626105',
    '64090416160',
    '80499688374',
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
