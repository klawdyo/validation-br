const test = require('tape');
const { isCNPJ } = require('../dist/documents');

test('CNPJs válidos', (t) => {
  const valid = [
    '11.222.333/0001-81',
    '73.797.980/0001-79',
    '06.946.762/0001-61',
    '96.051.576/0001-57',
    '55.585.709/0001-98',
    '99360938000180',
    '23693443000100',
    '32432147000147',
    '91951438000100',
  ];

  valid.forEach((key) => {
    t.true(isCNPJ(key), `CNPJ ${key} deve ser válido`);
  });

  t.end();
});

test('CNPJs inválidos', (t) => {
  const invalid = [
    '53.797.980/0001-79',
    '36.946.762/0001-61',
    '26.051.576/0001-57',
    '85.585.709/0001-98',
    '39360938000180',
    '93693443000100',
    '12432147000147',
    '61951438000100',
  ];

  invalid.forEach((key) => {
    t.false(isCNPJ(key), `CNPJ ${key} deve ser inválido`);
  });

  t.end();
});
