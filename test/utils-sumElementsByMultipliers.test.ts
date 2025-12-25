import { sumElementsByMultipliers } from '../src/utils';

describe('sumElementsByMultipliers()', () => {
  test('Tipo do retorno', () => {
    const sum = sumElementsByMultipliers('1234', [9, 8, 7, 6]);

    expect(typeof sum).toBe('number');
    expect(sum).toBe(70);
  });

  test.each([
    { value: '1234', multipliers: [9, 8, 7, 6], expected: 70 },
    // cnpj
    { value: '112223330001', multipliers: [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], expected: 102 },
    // cpf
    { value: '280012389', multipliers: [10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 162 },
    { value: '2800123893', multipliers: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 201 },
    // titulo
  ])('Valores retornados', (item) => {
    const sum = sumElementsByMultipliers(item.value, item.multipliers);
    expect(sum).toBe(item.expected);

  });
});