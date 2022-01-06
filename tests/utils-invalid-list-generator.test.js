const test = require('tape');
const { invalidListGenerator } = require('../dist/lib/utils');

test('invalidListGenerator - Número de itens', (t) => {
  const list = invalidListGenerator(4);

  t.equal(list.length, 10, 'Deve ter 10 itens');
  t.true(Array.isArray(list), 'Deve ser um array');

  t.end();
});

test('invalidListGenerator - Tamanho dos itens', (t) => {
  const valid = [
    { length: 10, size: 8 },
    { length: 10, size: 4 },
  ];

  valid.forEach((item) => {
    const list = invalidListGenerator(item.size);
    t.equal(list[0], '0'.repeat(item.size), `invalidListGenerator(${item.size}) deve gerar itens com ${item.size} caracteres`);
  });

  t.end();
});
