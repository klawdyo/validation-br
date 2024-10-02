import { CNH } from '../src/cnh';
import * as _cnh from '../src/cnh';

describe('CNH', () => {
  describe('constructor', () => {
    test.each(['14490435923', '97286888262', '621049358-60', '491872350-50'])(
      'deve estar definido',
      (input) => {
        expect(new CNH(input)).toBeDefined();
      }
    );

    test.each([
      '50995131143',
      '58916794534',
      '50995471165',
      '69944271146',
      '46990906839',
      '629729276-37',
    ])('deve lançar erro', (input) => {
      expect(() => new CNH(input)).toThrow();
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('Gera fakes', () => {
      const cnh = CNH.fake();
      expect(cnh).toBeDefined();
      expect(cnh.value).toHaveLength(11);
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '501954711', expected: '65' },
      { num: '583164745', expected: '75' },
      { num: '690444711', expected: '17' },
    ])('O DV gerado deve estar correto', (item) => {
      const calcDv = CNH.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

    test.each(['50195471', '5831641745', ''])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => CNH.checksum(item)).toThrow();
      }
    );
  });

  describe('mask', () => {
    test.each([
      { value: '14490435923', expected: '144904359-23' },
      { value: '97286888262', expected: '972868882-62' },
      { value: '621049358-60', expected: '621049358-60' },
      { value: '491872350-50', expected: '491872350-50' },
    ])('máscara deve ser gerada corretamente', (input) => {
      const cnh = new CNH(input.value);

      expect(cnh.mask()).toBe(input.expected);
      expect(cnh.mask()).toHaveLength(12);
      expect(cnh.mask()).toMatch(/^\d{9}-\d{2}$/)
    });
  });
});
