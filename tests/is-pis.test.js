const test = require('tape');
const { isPIS } = require('../dist/documents');

test('PIS válidos', (t) => {
  const valid = [
    '712.82677.38-0',
    '237.95126.95-5',
    '500.12973.80-3',
    '278.90141.14-4',
    '268.27649.96-0',
    '613.01862.91-7',
  ];

  valid.forEach((key) => {
    t.true(isPIS(key), `PIS ${key} deve ser válido`);
  });

  t.end();
});

test('PIS inválidos', (t) => {
  const invalid = [
    '712.82677.38-2',
    '237.95126.95-4',
    '500.12973.80-1',
    '278.90141.14-9',
    '268.27649.96-2',
    '613.01862.91-4',
  ];

  invalid.forEach((key) => {
    t.false(isPIS(key), `PIS ${key} deve ser inválido`);
  });

  t.end();
});

test('PIS não informado', (t) => {
  t.false(isPIS(''), 'PIS vazio deve retornar false');
  t.end();
});
