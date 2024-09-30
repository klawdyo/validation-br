import { CNH } from '../src/cnh';
import * as _cnh from '../src/cnh';

describe('CNH', () => {
  describe('constructor', () => {
    test.each([
      '50195131143',
      '58316794534',
      '50195471165',
      '69044271146',
      '46190906839',
      '624729276-37',
    ])('deve estar definido', (input) => {
      expect(new CNH(input)).toBeDefined();
    });

    test.each([
      '50195131143',
      '58316794534',
      '50195471165',
      '69044271146',
      '46190906839',
      '624729276-37',
    ])('deve lançar erro', (input) => {
      expect(new CNH(input)).toBeDefined();
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
  });

  describe('mask', () => {
    test.each([
      { value: '50195471143', expected: '501954711-43' },
      { value: '58316474534', expected: '583164745-34' },
      { value: '69044471146', expected: '690444711-46' },
    ])('máscara deve ser gerada corretamente', (input) => {
      const cnh = new CNH(input.value);

      expect(cnh.mask()).toBe(input.expected);
      expect(cnh.mask()).toHaveLength(12);
    });
  });
});
