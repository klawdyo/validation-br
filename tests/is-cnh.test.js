const test = require('tape');
const { isCNH } = require('../dist/documents');
const {
  dv, fake, mask, validate, validateOrFail,
} = require('../dist/documents/cnh');

test('isCNH() - CNHs válidas', (t) => {
  [
    // como inteiro
    50195131143,
    58316794534,
    50195471165,
    // como string
    '69044271146',
    '46190906839',
    // com máscara
    '624729276-37',
  ].forEach((cnh) => {
    t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`);
  });

  t.end();
});

test('validate() - CNHs válidas', (t) => {
  [
    // como inteiro
    50195131143,
    58316794534,
    // como string
    '69044271146',
    '46190906839',
    // com máscara
    '624729276-37',
  ].forEach((cnh) => {
    t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`);
  });

  t.end();
});

test('validate() - CNHs inválidas', (t) => {
  [
    '50195471143',
    '58316474534',
    '69044471146',
    '33333333333',
    '88888888888',
  ].forEach((cnh) => {
    t.false(validate(cnh), `CNH ${cnh} deve ser inválida`);
  });

  t.end();
});

test('validateOrFail() - CNHs inválidas', (t) => {
  [
    '50195471143',
    '58316474534',
    '33333333333',
    '88888888888',
  ].forEach((cnh) => {
    t.throws(() => validateOrFail(cnh), `CNH ${cnh} deve lançar uma exceção`);
  });

  t.end();
});

test('CNH não informada', (t) => {
  t.false(isCNH(''), 'CNH vazio deve retornar false');
  t.false(validate(''), 'CNH vazio deve retornar false');
  t.throws(() => validateOrFail(''), 'CNH vazio deve lançar uma exceção');

  t.end();
});

test('fake() - Gera CNHs fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnh = fake();
    t.true(validate(cnh), `CNH ${cnh} deve ser válida`);
    t.assert(cnh.length === 11, `CNH ${cnh} deve ter 11 caracteres`);
  }

  t.end();
});

test('fake() - Gera CNHs fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const cnh = fake(true);
    t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`);
    t.assert(cnh.length === 12, `CNH ${cnh} deve ter 12 caracteres`);
  }

  t.end();
});

test('dv() - Verificando se o DV gerado está correto', (t) => {
  [
    { num: '501954711', expected: '65' },
    { num: 583164745, expected: '75' },
    { num: 690444711, expected: '17' },
  ].forEach((item) => {
    const calcDv = dv(item.num);

    t.equal(calcDv, item.expected, `DV da CNH ${item.num} é igual a ${item.expected}`);
    t.assert(typeof calcDv === 'string', 'DV é do tipo string');
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { value: 50195471143, expected: '501954711-43' },
    { value: 58316474534, expected: '583164745-34' },
    { value: 69044471146, expected: '690444711-46' },
  ].forEach((item) => {
    const masked = mask(item.value);
    t.equal(masked, item.expected, `${item.value} com máscara é igual a ${item.expected}`);
    t.assert(masked.length === 12, `${masked} tem 12 caracteres`);
  });

  t.end();
});
