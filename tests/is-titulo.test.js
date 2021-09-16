const test = require('tape');
const { isTitulo } = require('../dist/documents');

test('Títulos de eleitor válidos', (t) => {
  const valid = [
    '102385010671',
    '836571371619',
    '743650641660',
    '153036161686',
    '525028881694',
    '026327681660',
    '558657441635',
  ];

  valid.forEach((key) => {
    t.true(isTitulo(key), `Título de eleitor ${key} deve ser válido`);
  });

  t.end();
});

test('Títulos de eleitor inválidos', (t) => {
  const invalid = [
    '836531371619',
    '743620641660',
    '153016161686',
    '525078881694',
    '026367681660',
    '558647441635',
  ];

  invalid.forEach((key) => {
    t.false(isTitulo(key), `Título de eleitor ${key} deve ser inválido`);
  });

  t.end();
});
