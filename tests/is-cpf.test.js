const test = require('tape');
const { isCPF } = require('../dist/documents');
const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/cpf');

test('isCPF() - CPFs válidos', (t) => {
  [
    '087.967.420-20',
    '133.782.710-00',
    '400.448.260-79',
    74172316085,
    '15886489070',
    '90889477086',
  ].forEach((key) => {
    t.true(isCPF(key), `CPF ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - CPFs válidos', (t) => {
  [
    '087.967.420-20',
    '133.782.710-00',
    '400.448.260-79',
    74172316085,
    '15886489070',
    '90889477086',
  ].forEach((key) => {
    t.true(validate(key), `CPF ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - CPFs inválidos', (t) => {
  [
    '287.967.420-20',
    '333.782.710-00',
    '200.448.260-79',
    '24172316085',
    '25886489070',
    '20889477086',
  ].forEach((key) => {
    t.false(validate(key), `CPF ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - CPFs inválidos', (t) => {
  [
    '287.967.420-20',
    '333.782.710-00',
    '200.448.260-79',
    '24172316085',
    '25886489070',
    '20889477086',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `CPF ${key} deve retornar uma exceção`);
  });

  t.end();
});

test('CPF não informado', (t) => {
  t.false(isCPF(''), 'CPF vazio deve retornar false');
  t.false(validate(''), 'CPF vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'CPF vazio deve lançar exceção');
  t.end();
});

test('fake() - Gera CPFs fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnpj = fake();

    t.true(validate(cnpj),
      `CPF fake ${cnpj} deve ser válido`);
    t.assert(cnpj.length === 11,
      `CPF ${cnpj} precisa ter 11 caracteres`);
  }

  t.end();
});

test('fake() - Gera CPFs fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnpj = fake(true);

    t.true(validate(cnpj), `CPF fake ${cnpj} deve ser válido`);
    t.assert(cnpj.length === 14,
      `CPF ${cnpj} precisa ter 14 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: '741723160', expected: '85' },
    { num: 158864890, expected: '70' },
    { num: '908894770', expected: '86' },
  ].forEach((item) => {
    const calcDV = dv(item.num);

    t.equal(calcDV, item.expected,
      `${item.num} deve gerar um DV igual a ${item.expected}`);
    t.assert(typeof calcDV === 'string', `O DV ${item.expected} precisa ser uma string`);
    t.assert(calcDV.length === 2, `O DV ${item.expected} precisa ter 2 caracteres`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { num: '74172316085', expected: '741.723.160-85' },
    { num: 15886489070, expected: '158.864.890-70' },
    { num: '90889477086', expected: '908.894.770-86' },
  ].forEach((item) => {
    t.equal(mask(item.num), item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);
  });

  t.end();
});
