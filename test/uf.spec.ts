import { UF } from '../src/uf';

describe('UF', () => {
  describe('constructor', () => {
    test('deve estar definido', () => {
      expect(new UF('RN')).toBeDefined();
    });

    test('deve estar definido', () => {
      expect(
        new UF({ short: 'RN', name: 'Rio Grande do Norte' })
      ).toBeDefined();
    });

    test('deve lançar um erro de uf inválida', () => {
      expect(() => new UF('JJ')).toThrow();
    });

    test('deve lançar um erro de uf vazia', () => {
      expect(() => new UF('')).toThrow();
      expect(() => new UF(undefined as any)).toThrow();
      expect(() => new UF(null as any)).toThrow();
    });
  });

  describe('getName', () => {
    test('deve localizar um nome a partir da sigla', () => {
      const uf = new UF('RN');
      expect(uf.getName()).toBe('Rio Grande do Norte');
      expect(uf.name).toBe('Rio Grande do Norte');
    });
  });

  describe('value', () => {
    test('deve retornar o próprio valor inserido no construtor', () => {
      const uf = new UF('RN');
      expect(uf.value).toBe('RN');
      expect(uf.short).toBe('RN');
      expect(uf.toString()).toBe('RN');
    });
  });

  describe('getList()', () => {
    test('deve retornar a lista', () => {
      const list = UF.getList();
      expect(list).toBeInstanceOf(Array);
      expect(list.length).toBe(27);
    });
  });

  describe('getRandom()', () => {
    test('deve retornar um estado aleatoriamente', () => {
      const random = UF.getRandom();
      expect(new UF(random.toString())).toBeDefined();
    });
  });
});
