const test = require('tape');
const { fakeNumber } = require('../dist/lib/utils');

test('fakeNumber - forceLength = true', (t) => {
  const num = fakeNumber(4, true);

  t.equal(num.length, 4, 'Deve ter 4 caracteres');
  t.equal(typeof num, 'string', 'Deve ser uma string');
  t.assert(/^[\d]+$/.test(num), 'Deve ser somente número');

  t.end();
});

test('fakeNumber - forceLength = false', (t) => {
  const num = fakeNumber(4);

  t.equal(num >= 0 && num <= 9999, true, 'Deve ser maior que 0 e menor que 9999');
  t.equal(typeof num, 'number', 'Deve ser um número');
  t.end();
});
