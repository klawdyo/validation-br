const test = require('tape');
const { isPostalCode } = require('../dist/documents');

const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/postal-code');

test('isPostalCode() - Códigos Postais válidos', (t) => {
  [
    'PN718252423BR',
    'PO925539762BR',
    'JT194690698BR',
    'SV143851674BR',
    'RG727348650CN',
    'RY747622885CN',
    'RY728187035CN',
    'RH940629235CN',
    'RY686586175CN',
    'RY648001205CN',
    'UJ776469464CN',
    'LZ667841882CN',
    'RS737783818NL',
  ].forEach((key) => {
    t.true(isPostalCode(key), `Código Postal ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Códigos Postais válidos', (t) => {
  [
    'PN718252423BR',
    'PO925539762BR',
    'JT194690698BR',
    'SV143851674BR',
    'RG727348650CN',
    'RY747622885CN',
    'RY728187035CN',
    'RH940629235CN',
    'RY686586175CN',
    'RY648001205CN',
    'UJ776469464CN',
    'LZ667841882CN',
    'RS737783818NL',
  ].forEach((key) => {
    t.true(validate(key), `Código Postal ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Códigos Postais inválidos', (t) => {
  [
    'PO925524762BR',
    'JT194624698BR',
    'SV143824674BR',
    'RG727324650CN',
    'RY747624885CN',
    'RY728114035CN',
  ].forEach((key) => {
    t.false(validate(key), `Código Postal ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - Códigos Postais inválidos devem lançar exceção', (t) => {
  [
    'PO925524762BR',
    'JT194624698BR',
    'SV143824674BR',
    'RG727324650CN',
    'RY747624885CN',
    'RY728114035CN',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `Código Postal ${key} deve ser inválido`);
  });

  t.end();
});

test('PostalCode não informado', (t) => {
  t.false(isPostalCode(''), 'PostalCode vazio deve retornar false');
  t.false(validate(''), 'PostalCode vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'PostalCode vazio deve lançar exceção');
  t.end();
});

test('fake() - Gera PostalCodes fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const pis = fake();

    t.true(validate(pis),
      `PostalCode fake ${pis} deve ser válido`);
    t.assert(pis.length === 13,
      `PostalCode ${pis} precisa ter 13 caracteres`);
  }

  t.end();
});

test('fake() - Gera PostalCodes fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const pis = fake(true);

    t.true(validate(pis), `PostalCode fake ${pis} deve ser válido`);
    t.assert(pis.length === 13,
      `PostalCode ${pis} precisa ter 13 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: 'PN718252423BR', expected: '3' },
    { num: 'PO925539762BR', expected: '2' },
    { num: 'JT194690698BR', expected: '8' },
  ].forEach((item) => {
    const calcDV = dv(item.num);

    t.equal(calcDV, item.expected,
      `${item.num} deve gerar um DV igual a ${item.expected}`);

    t.assert(typeof calcDV === 'string', `O DV ${item.expected} precisa ser uma string`);
    t.assert(calcDV.length === 1, `O DV ${item.expected} precisa ter 1 caractere`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { num: 'pn718252423br', expected: 'PN718252423BR' },
    { num: 'po925539762br', expected: 'PO925539762BR' },
    { num: 'jt194690698br', expected: 'JT194690698BR' },
  ].forEach((item) => {
    const masked = mask(item.num);

    t.equal(masked, item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);

    t.assert(masked.length === 13, `O PostalCode ${item.expected} precisa ter 13 caracteres com máscara`);
  });

  t.end();
});
