import { UF } from '../src/uf';

describe('UF', () => {
  describe('constructor', () => {
    test('deve estar definido', () => {
      const uf = new UF('RN');
      expect(uf).toBeDefined();
      expect(uf.short).toBe('RN')
      expect(uf.value).toBe('RN')
      expect(uf.name).toBe('Rio Grande do Norte')
    });

    test('deve estar definido', () => {
      const uf = new UF('rn');
      expect(uf).toBeDefined();
      expect(uf.short).toBe('RN')
      expect(uf.value).toBe('RN')
      expect(uf.name).toBe('Rio Grande do Norte')
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

  describe('static uf methods', () => {
    test('devem estar definidos', () => {
      
      expect(UF.AC).toBeDefined()
      expect(UF.AL).toBeDefined()
      expect(UF.AP).toBeDefined()
      expect(UF.AM).toBeDefined()
      expect(UF.BA).toBeDefined()
      expect(UF.CE).toBeDefined()
      expect(UF.DF).toBeDefined()
      expect(UF.ES).toBeDefined()
      expect(UF.GO).toBeDefined()
      expect(UF.MA).toBeDefined()
      expect(UF.MT).toBeDefined()
      expect(UF.MS).toBeDefined()
      expect(UF.MG).toBeDefined()
      expect(UF.PA).toBeDefined()
      expect(UF.PB).toBeDefined()
      expect(UF.PR).toBeDefined()
      expect(UF.PE).toBeDefined()
      expect(UF.PI).toBeDefined()
      expect(UF.RJ).toBeDefined()
      expect(UF.RN).toBeDefined()
      expect(UF.RS).toBeDefined()
      expect(UF.RO).toBeDefined()
      expect(UF.RR).toBeDefined()
      expect(UF.SC).toBeDefined()
      expect(UF.SP).toBeDefined()
      expect(UF.SE).toBeDefined()
      expect(UF.TO).toBeDefined()


    });
  });
});
