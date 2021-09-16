const test = require('tape');
const { sumToDV } = require('../dist/lib/utils');

test('sumToDV', (t) => {
  const valid = {
    102: 8,
    120: 1,
    162: 3,
    179: 8,
  };

  Object.keys(valid).forEach((key) => {
    t.equal(sumToDV(key), valid[key], `A Soma ${key} deve resultar DV ${valid[key]}`);
  });

  t.end();
});
