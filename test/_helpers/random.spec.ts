import { Random } from '../../src/_helpers/random';

describe('Random', () => {
  describe('number', () => {

    test.each([1, 5, 10, 36])('deve gerar um número aleatório', (length) => {
      const num = Random.number(length);
      expect(num).toBeDefined();
      expect(+num < Math.pow(10, length))
    });

    test.each([1, 5, 10, 36])('deve gerar um número aleatório com tamanho fixo', (length) => {
      const num = Random.number(length, true);
      expect(num).toBeDefined();
      expect(num.length).toBe(length);
    });

    test.each([1, 5, 10, 36])('deve gerar caracteres alfanuméricos aleatórios', (length) => {
      const num = Random.number(length, true, true);
      expect(num).toBeDefined();
      expect(num.length).toBe(length);
      expect(num).toMatch(/[a-z0-9]/i)
    });
  });

  describe('between', () => {
    test('deve gerar um número entre 1 e 10', () => {
      const num = Random.between(1, 10);
      expect(num).toBeDefined();
      expect(num >= 1).toBeTruthy();
      expect(num <= 10).toBeTruthy();
    });
  });

  describe('alpha', () => {
    test.each([undefined, 1, 2, 5, 10])('deve gerar caracteres aleatórios', (length) => {
      const num = Random.alpha(length as any);
      expect(num).toBeDefined();
      expect(num).toMatch(/^[a-z]+$/)
      expect(num.length).toBe(length || 1);
    });

    test.each([undefined, 1, 2, 5, 10])('deve gerar caracteres maiúsculos aleatórios', (length) => {
      const num = Random.alpha(length as any, true);
      expect(num).toBeDefined();
      expect(num).toMatch(/^[A-Z]+$/)
      expect(num.length).toBe(length || 1);
    });

    test.only.each([undefined, 1, 2, 5, 10])('deve gerar caracteres hexadecimais aleatórios', (length) => {
      const num = Random.alpha(length as any, false, true);
      
      expect(num).toBeDefined();
      expect(num).toMatch(/^[0-9a-f]+$/)
      expect(num.length).toBe(length || 1);
    });
  });

  describe('fromArray', () => {
    test('deve pegar um valor aleatório do array', () => {
      const possibilities = [1, 2, 3, 4, 5];
      const num = Random.fromArray(possibilities);
      expect(num).toBeDefined();
      expect(possibilities.includes(num)).toBeTruthy();
    });
  });
});
