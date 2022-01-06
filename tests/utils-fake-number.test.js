const test = require('tape');
const { fakeNumber } = require('../dist/lib/utils');

test('fakeNumber - Verifica se o tamanho está correto', (t) => {
  const list = fakeNumber(4);

  t.equal(list.length, 4, 'Deve ter 4 caracteres');
  t.equal(typeof list, 'string', 'Deve ser uma string');
  t.assert(/^[\d]+$/.test(list), 'Deve ser somente número');

  t.end();
});
