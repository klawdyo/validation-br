const test = require('tape');
const { isCNH } = require('../dist/documents');

test('CNHs válidas', (t) => {
  const valid = [
    '50195131143',
    '58316794534',
    '69044271146',
    '46190906839',
    '62472927637',
  ];

  valid.forEach((cnh) => {
    t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`);
  });

  t.end();
});

test('CNHs inválidas', (t) => {
  const invalid = [
    '50195471143',
    '58316474534',
    '69044471146',
    '46190476839',
    '62472477637',
    '00000000000',
    '33333333333',
    '88888888888',
  ];

  invalid.forEach((cnh) => {
    t.false(isCNH(cnh), `CNH ${cnh} deve ser inválida`);
  });

  t.end();
});

test('CNH não informada', (t) => {
  t.false(isCNH(''), 'CNH vazio deve retornar false');
  t.end();
});
