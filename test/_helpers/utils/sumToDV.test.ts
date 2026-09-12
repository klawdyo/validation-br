import { sumToDV } from '../../../src/_helpers/utils';

describe('sumToDV()', () => {
  test('Os resultados devem ser os esperados', () => {
    const list = [
      { value: 102, expected: 8 },
      { value: 120, expected: 1 },
      { value: 162, expected: 3 },
      { value: 179, expected: 8 },
    ]

    list.forEach((item) => {
      expect(sumToDV(item.value)).toBe(item.expected)
    })
  })

  describe('restException', () => {
    test.each([
      110, // resto 0
      121, // resto 0
      111, // resto 1
      100, // resto 1
    ])('deve devolver 0 por padrão quando o resto da divisão por 11 for menor que 2 (soma: %i)', (sum) => {
      expect(sumToDV(sum)).toBe(0);
      expect(sumToDV(sum, 0)).toBe(0);
    });

    test.each([
      110, // resto 0
      121, // resto 0
      111, // resto 1
      100, // resto 1
    ])('deve devolver o restException quando o resto da divisão por 11 for menor que 2 (soma: %i)', (sum) => {
      expect(sumToDV(sum, 1)).toBe(1);
    });

    test.each([
      { value: 102, expected: 8 }, // resto 3
      { value: 120, expected: 1 }, // resto 10
      { value: 162, expected: 3 }, // resto 8
      { value: 179, expected: 8 }, // resto 3
    ])('não deve alterar o resultado quando o resto for maior ou igual a 2 (soma: $value)', ({ value, expected }) => {
      expect(sumToDV(value, 1)).toBe(expected);
    });
  });
})
