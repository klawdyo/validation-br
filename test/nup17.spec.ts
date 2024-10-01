import { NUP17 } from '../src/nup17';

describe('NUP17', () => {
  describe('constructor', () => {
    test.each([
      // Masked
      '23037.001380/2021-11',
      '23037.001434/2021-48',
      '23037.001321/2021-42',
      // String
      '23037001462202165',
      '23037001537202116',
      '23037001086202117',
    ])('%s deve ser definido', (input) => {
      expect(new NUP17(input)).toBeDefined();
    });

    test.each([
      '23037001380202112',
      '23037001434202142',
      '23037001462202162',
      '23037001537202112',
      '', // vazio
      '023037001537202112', // caracteres a mais
      '3037001537202112', // caracteres a menos
      null,
      undefined,
    ])('%s deve lançar erro', (input) => {
      expect(() => new NUP17(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '23037001380202111', expected: '23037.001380/2021-11' },
      { num: '23037001434202148', expected: '23037.001434/2021-48' },
      { num: '23037001321202142', expected: '23037.001321/2021-42' },
      { num: '23037001462202165', expected: '23037.001462/2021-65' },
      { num: '23037001537202116', expected: '23037.001537/2021-16' },
      { num: '23037001086202117', expected: '23037.001086/2021-17' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
      const masked = new NUP17(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^\d{5}\.\d{6}\/\d{4}-\d{2}$/);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('Deve gerar fake válido', () => {
      const result = NUP17.fake();
      expect(result).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '230370013802021', expected: '11' },
      { num: '230370014342021', expected: '48' },
      { num: '230370013212021', expected: '42' },
      { num: '230370014622021', expected: '65' },
      { num: '230370015372021', expected: '16' },
      { num: '230370010862021', expected: '17' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = NUP17.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

        
    test.each(['23037001462202', '2303700146220211', ''])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => NUP17.checksum(item)).toThrow();
      }
    );
  });
});
