import { CarPlate } from '../src/carplate';
import { isCarPlate } from '../src/main';

describe('CarPlate', () => {
  describe('construtor', () => {
    test.each([
      'AAA0000',
      'AAA-0000',
      'AAA0F00',
      'AAA-0F00',
      'AbA0F00',
      'abc-0h00',
      'abc-0h00 ',
    ])('A placa %s deve ser válida', (input) => {
      expect(new CarPlate(input)).toBeDefined();
    });

    test.each([
      'A2A0000',
      'AAA-00A0',
      'AAA0F0',
      'AAA0F077',
      'AAA0F-077',
      '',
      null,
      undefined,
    ])('A placa %s deve lançar erro', (input) => {
      expect(() => new CarPlate(input as any)).toThrow();
    });
  });

  describe('isCarPlate', () => {
    test.each([
      'AAA0000',
      'AAA-0000',
      'AAA0F00',
      'AAA-0F00',
      'AbA0F00',
      'abc-0h00',
    ])('A placa %s deve ser válida', (clarPlate) => {
      expect(isCarPlate(clarPlate)).toBeTruthy();
    });

    test.each([
      'A2A0000',
      'AAA-00A0',
      'AAA0F0',
      'AAA0F077',
      '',
      null,
      undefined,
    ])('A placa %s não deve ser válida', (clarPlate) => {
      expect(isCarPlate(clarPlate as any)).toBeFalsy();
    });
  });

  describe('checlsum', () => {
    test('Car plate não tem DV', () => {
      expect(() => CarPlate.checksum('MYN-7442'));
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('Gera fakes sem mascara', () => {
      expect(CarPlate.fake()).toBeDefined();
    });
  });

  describe('mask', () => {
    test.each([
      'AAA0000',
      'AAA0900',
      'AAA0F00',
      'AGA0F00',
      'aba0F00',
      'abc0h00',
    ])('A placa %s deve ser válida', (clarPlate) => {
      const masked = new CarPlate(clarPlate).mask();
      expect(masked).toBeDefined();
      expect(masked).toBe(masked.toLocaleUpperCase());
      expect(masked.length).toBe(8);
      expect(masked).toMatch(/^[A-Z]{3}-[0-9][A-Z0-9][0-9]{2}$/);
    });
  });
});
