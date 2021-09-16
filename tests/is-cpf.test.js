const test = require('tape');
const { isCPF } = require('../dist/documents');

test('CPFs válidos', (t) => {
  const valid = [
    '087.967.420-20',
    '133.782.710-00',
    '400.448.260-79',
    '74172316085',
    '15886489070',
    '90889477086',
  ];

  valid.forEach((key) => {
    t.true(isCPF(key), `CPF ${key} deve ser válido`);
  });

  t.end();
});

test('CPFs inválidos', (t) => {
  const invalid = [
    '287.967.420-20',
    '333.782.710-00',
    '200.448.260-79',
    '24172316085',
    '25886489070',
    '20889477086',
  ];

  invalid.forEach((key) => {
    t.false(isCPF(key), `CPF ${key} deve ser inválido`);
  });

  t.end();
});

test('CPF não informado', (t) => {
  t.false(isCPF(''), 'CPF vazio deve retornar false');
  t.end();
});
