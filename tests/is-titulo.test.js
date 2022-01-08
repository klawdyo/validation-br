const test = require('tape');
const { isTitulo } = require('../dist/documents');

const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/titulo-eleitor');

test('isTitulo() - Títulos de eleitor válidos', (t) => {
  [
    '102385010671',
    '836571371619',
    '743650641660',
    '153036161686',
    '525028881694',
    11122223360,
    1122223336,
  ].forEach((key) => {
    t.true(isTitulo(key), `Título de eleitor ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Títulos de eleitor válidos', (t) => {
  [
    '102385010671',
    '836571371619',
    '743650641660',
    '153036161686',
    '525028881694',
    11122223360,
    1122223336,

  ].forEach((key) => {
    t.true(validate(key), `Título de eleitor ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Títulos de eleitor inválidos', (t) => {
  [
    '836531371619',
    '743620641660',
    '153016161686',
    '525078881694',
    '026367681660',
    '558647441635',
    '222222222222',
  ].forEach((key) => {
    t.false(validate(key), `Título de eleitor ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - Títulos de eleitor inválidos devem lançar exceção', (t) => {
  [
    '836531371619',
    '743620641660',
    '153016161686',
    '525078881694',
    '026367681660',
    '558647441635',
    '222222222222',
  ].forEach((key) => {
    t.throws(() => validateOrFail(key), `Título de eleitor ${key} deve ser inválido`);
  });

  t.end();
});

test('Título não informado', (t) => {
  t.false(isTitulo(''), 'Título vazio deve retornar false');
  t.false(validate(''), 'Título vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'Título vazio deve lançar exceção');
  t.end();
});

test('fake() - Gera Títulos fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const titulo = fake();

    t.true(validate(titulo),
      `Título fake ${titulo} deve ser válido`);
    t.assert(titulo.length === 12,
      `Título ${titulo} precisa ter 12 caracteres`);
  }

  t.end();
});

test('fake() - Gera Títulos fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const titulo = fake(true);

    t.true(validate(titulo), `Título fake ${titulo} deve ser válido`);
    t.assert(titulo.length === 14,
      `Título ${titulo} precisa ter 14 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: '1023850106', expected: '71' },
    { num: '8365713716', expected: '19' },
    { num: '7436506416', expected: '60' },
    { num: 11222233, expected: '36' },
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
    { num: '102385010671', expected: '1023.8501.0671' },
    { num: '836571371619', expected: '8365.7137.1619' },
    { num: '743650641660', expected: '7436.5064.1660' },
    { num: 11122223360, expected: '0111.2222.3360' },
    { num: 1122223336, expected: '0011.2222.3336' },
  ].forEach((item) => {
    const masked = mask(item.num);

    t.equal(masked, item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);

    t.assert(masked.length === 14, `O Título ${item.expected} precisa ter 14 caracteres com máscara`);
  });

  t.end();
});
