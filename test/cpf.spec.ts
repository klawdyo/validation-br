import { CPF } from '../src/cpf';

describe('CPF', () => {
  describe('constructor', () => {
    test.each([
      '133.782.710-00',
      '400.448.260-79',
      '08796742020',
      '74172316085',
      '15886489070',
      '90889477086',
    ])('deve estar definido', (input) => {
      expect(new CPF(input)).toBeDefined();
    });

    test.each([
      '287.967.420-20',
      '333.782.710-00',
      '200.448.260-79',
      '24172316085',
      '25886489070',
      '20889477086',
      '11111111111', // repetido
      '', // vazio
      '012345678900', // caracteres a mais
      '12345678', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro', (input) => {
      expect(() => new CPF(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '74172316085', expected: '741.723.160-85' },
      { num: '15886489070', expected: '158.864.890-70' },
      { num: '90889477086', expected: '908.894.770-86' },
      { num: '00889477000', expected: '008.894.770-00' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {    
      const masked = new CPF(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toHaveLength(14);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
      const cpf = CPF.fake();
      expect(cpf).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '741723160', expected: '85' },
      { num: '158864890', expected: '70' },
      { num: '908894770', expected: '86' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = CPF.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });
  });
});
