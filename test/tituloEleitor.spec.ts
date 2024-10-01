import { TituloEleitor } from "../src/tituloEleitor";

describe('TituloEleitor', () => {
  describe('constructor', () => {
    test.each([
     // masked
     '1023.8501.0671',
     '8365.7137.1619',
     // string
     '153036161686',
     '525028881694',
     // integer
     '011122223360',
     '001122223336',
    ])('deve estar definido', (input) => {
      expect(new TituloEleitor(input)).toBeDefined();
    });

    test.each([
      '836531371619',
      '743620641660',
      '153016161686',
      '525078881694',
      '026367681660',
      '558647441635',
      '222222222222',
      '', // vazio
      '012345678900', // caracteres a mais
      '12345678', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro', (input) => {
      expect(() => new TituloEleitor(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '102385010671', expected: '1023.8501.0671' },
      { num: '836571371619', expected: '8365.7137.1619' },
      { num: '743650641660', expected: '7436.5064.1660' },
      { num: '011122223360', expected: '0111.2222.3360' },
      { num: '001122223336', expected: '0011.2222.3336' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {    
      const masked = new TituloEleitor(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^\d{4}.\d{4}.\d{4}$/)
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
      const result = TituloEleitor.fake();
      expect(result).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '1023850106', expected: '71' },
      { num: '8365713716', expected: '19' },
      { num: '7436506416', expected: '60' },
      { num: '0011222233', expected: '36' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = TituloEleitor.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });
  });
});
