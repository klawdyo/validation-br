const test = require('tape');
const { sumElementsByMultipliers } = require('../dist/lib/utils');

test('sumElementsByMultipliers - Tipo do retorno', (t) => {
  const sum = sumElementsByMultipliers('1234', '9876');

  t.equal(typeof sum, 'number', 'Deve retornar um número');
  t.equal(sum, 70, 'Precisa ser igual a 70');

  t.end();
});

test('sumElementsByMultipliers - Valores retornados', (t) => {
  const valid = [
    { input: '1234', multipliers: '9876', expected: 70 },
    { input: '1234', multipliers: [9, 8, 7, 6], expected: 70 },
    // cnpj
    { input: '112223330001', multipliers: [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], expected: 102 },
    { input: '1122233300018', multipliers: '6543298765432', expected: 120 },
    // cpf
    { input: '280012389', multipliers: [10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 162 },
    { input: '2800123893', multipliers: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 201 },
    // titulo
    { input: '10238501', multipliers: '23456789', expected: 117 },
    { input: '067', multipliers: '789', expected: 111 },

  ];

  valid.forEach((item) => {
    const sum = sumElementsByMultipliers(item.input, item.multipliers);
    t.equal(sum, item.expected, `Precisa ser igual a ${item.expected}`);
  });

  t.end();
});
