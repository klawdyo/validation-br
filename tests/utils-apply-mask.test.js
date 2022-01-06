const test = require('tape');
const { applyMask } = require('../dist/lib/utils');

test('applyMask - Verifica se o tamanho está correto', (t) => {
  // const list = applyMask('123456', '00000-0');

  const items = [
    { value: '123456', mask: '00000-0', expected: '12345-6' },
    { value: '12345', mask: '00000-0', expected: '01234-5' },
    { value: '123456789', mask: '00000-0', expected: '12345-6' },
  ];

  items.forEach((item) => {
    t.equal(item.expected.length, item.mask.length, `Deve ter ${item.mask.length} caracteres`);
    t.equal(applyMask(item.value, item.mask), item.expected, `O ${item.value} com máscara ${item.mask} deve ser ${item.expected}`);
    // t.equal(item.expected.length, item.mask.length, `Deve ter ${item.mask.length} caracteres`);
  });

  t.end();
});
