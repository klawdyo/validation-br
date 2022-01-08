const test = require('tape');
const { isCNPJ } = require('../dist/documents');
const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/cnpj');

test('isCNPJ() - CNPJs válidos', (t) => {
  [
    // Com máscara
    '11.222.333/0001-81',
    '73.797.980/0001-79',
    '06.946.762/0001-61',
    '96.051.576/0001-57',
    '55.585.709/0001-98',
    // inteiro
    99360938000180,
    23693443000100,
    // string
    '32432147000147',
    '91951438000100',
  ].forEach((key) => {
    t.true(isCNPJ(key), `CNPJ ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - CNPJs válidos', (t) => {
  [
    // Com máscara
    '11.222.333/0001-81',
    '73.797.980/0001-79',
    '06.946.762/0001-61',
    '96.051.576/0001-57',
    '55.585.709/0001-98',
    // inteiro
    99360938000180,
    23693443000100,
    // string
    '32432147000147',
    '91951438000100',
  ].forEach((key) => {
    t.true(validate(key), `CNPJ ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - CNPJs inválidos', (t) => {
  [
    '53.797.980/0001-79',
    '36.946.762/0001-61',
    '26.051.576/0001-57',
    '85.585.709/0001-98',
    '39360938000180',
    '93693443000100',
    '12432147000147',
    '61951438000100',
  ].forEach((key) => {
    t.false(validate(key), `CNPJ ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - CNPJs inválidos devem lançar exceção', (t) => {
  [
    '53.797.980/0001-79',
    '36.946.762/0001-61',
    '26.051.576/0001-57',
    '85.585.709/0001-98',
    '39360938000180',
    '93693443000100',
    '12432147000147',
    '61951438000100',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `CNPJ ${key} deve lançar exceção`);
  });

  t.end();
});

test('CNPJ não informado', (t) => {
  t.false(isCNPJ(''), 'CNPJ vazio deve retornar false');
  t.false(validate(''), 'CNPJ vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'CNPJ vazio deve lançar exceção');
  t.end();
});

test('fake() - Gera CNPJs fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnpj = fake();

    t.true(validate(cnpj),
      `CNPJ fake ${cnpj} deve ser válido`);
    t.assert(cnpj.length === 14,
      `CNPJ ${cnpj} precisa ter 14 caracteres`);
  }

  t.end();
});

test('fake() - Gera CNPJs fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnpj = fake(true);

    t.true(validate(cnpj), `CNPJ fake ${cnpj} deve ser válido`);
    t.assert(cnpj.length === 18,
      `CNPJ ${cnpj} precisa ter 18 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: '112223330001', expected: '81' },
    { num: 993609380001, expected: '80' },
    { num: '324321470001', expected: '47' },
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
    { num: '11222333000181', expected: '11.222.333/0001-81' },
    { num: 99360938000180, expected: '99.360.938/0001-80' },
    { num: '32432147000147', expected: '32.432.147/0001-47' },
    { num: 432147000147, expected: '00.432.147/0001-47' },
  ].forEach((item) => {
    const masked = mask(item.num);

    t.equal(masked, item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);

    t.assert(masked.length === 18, `O CPF ${item.expected} precisa ter 14 caracteres com máscara`);
  });

  t.end();
});
