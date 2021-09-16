const test = require('tape');
const { isPostalCode } = require('../dist/documents');

test('Códigos Postais válidos', (t) => {
  const valid = [
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
  ];

  valid.forEach((key) => {
    t.true(isPostalCode(key), `Código Postal ${key} deve ser válido`);
  });

  t.end();
});

test('Códigos Postais inválidos', (t) => {
  const invalid = [
    'PO925524762BR',
    'JT194624698BR',
    'SV143824674BR',
    'RG727324650CN',
    'RY747624885CN',
    'RY728114035CN',
  ];

  invalid.forEach((key) => {
    t.false(isPostalCode(key), `Código Postal ${key} deve ser inválido`);
  });

  t.end();
});

test('Código Postal não informado', (t) => {
  t.false(isPostalCode(''), 'Código Postal vazio deve retornar false');
  t.end();
});
