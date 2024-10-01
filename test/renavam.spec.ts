import { Renavam } from '../src/renavam';

describe('Renavam', () => {
  describe('constructor', () => {
    test.each([
      '1952519770-3',
      '3394038959-9',
      '03607626105',
      '64090416160',
      '80499688374',
      '40650543741',
    ])('deve estar definido', (input) => {
      expect(new Renavam(input)).toBeDefined();
    });

    test.each([
      '19525227703',
      '33940229599',
      '03607226105',
      '64090226160',
      '80499228374',
      '', // vazio
      '012345678900', // caracteres a mais
      '12345678', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro', (input) => {
      expect(() => new Renavam(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '03607626105', expected: '0360762610-5' },
      { num: '64090416160', expected: '6409041616-0' },
      { num: '80499688374', expected: '8049968837-4' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
      const masked = new Renavam(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^\d{10}-\d{1}$/);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
      const result = Renavam.fake();
      expect(result).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '1952519770', expected: '3' },
      { num: '0952519770', expected: '6' },
      { num: '0052519770', expected: '2' },
    ])('Deve gerar o dv correto', (item) => {
      const calcDv = Renavam.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

    test.each(['00525197701', '0052519770-1', '005251977'])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => Renavam.checksum(item)).toThrow();
      }
    );
  });
});
