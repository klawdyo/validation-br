import { CBISinter } from "../src/cbi_sinter";

describe('CBISinter', () => {
  describe('validate()', () => {
    test('Deve validar um CIB válido com máscara (Exemplo Oficial)', () => {
      const cbi = new CBISinter('A3N8Z4F-Y');
      expect(cbi.value).toBe('A3N8Z4FY');
    });

    test('Deve validar um CIB válido sem máscara', () => {
      const cbi = new CBISinter('A3N8Z4FY');
      expect(cbi.value).toBe('A3N8Z4FY');
    });

    test('Deve validar um CIB válido com letras minúsculas', () => {
      const cbi = new CBISinter('a3n8z4f-y');
      expect(cbi.value).toBe('A3N8Z4FY');
    });

    test('Deve validar um CIB com substituições (I/L -> 1, O -> 0)', () => {
      // Base '0000001' -> DV '8' (Cálculo: 1*8 = 8 % 31 = 8)
      // Input 'O0O0O0L-8' -> Normaliza para '00000018'
      const cbi = new CBISinter('O0O0O0L-8');
      expect(cbi.value).toBe('00000018');
    });

    test('Deve lançar erro para CIB com DV inválido', () => {
      expect(() => new CBISinter('A3N8Z4F-X')).toThrow();
    });

    test('Deve lançar erro para CIB com tamanho menor que o permitido', () => {
      expect(() => new CBISinter('A3N8Z4')).toThrow();
    });

    test('Deve lançar erro para CIB com tamanho maior que o permitido', () => {
      expect(() => new CBISinter('A3N8Z4FYA')).toThrow();
    });

    test('Deve lançar erro se contiver caractere proibido U', () => {
      expect(() => new CBISinter('A3U8Z4F-Y')).toThrow();
    });

    test('Deve lançar erro para valor vazio', () => {
      expect(() => new CBISinter('')).toThrow();
    });
  });

  describe('checksum()', () => {
    test('Deve calcular o DV corretamente (Exemplo da documentação)', () => {
      expect(CBISinter.checksum('A3N8Z4F')).toBe('Y');
    });

    test('Deve lançar erro se valor vazio', () => {
      expect(() => CBISinter.checksum('')).toThrow();
    });

    test('Deve lançar erro se formato inválido (tamanho incorreto)', () => {
      expect(() => CBISinter.checksum('A3N8Z4')).toThrow();
    });
  });

  describe('fake()', () => {
    test.each([...Array(50)])('Deve gerar um CIB válido', () => {
      const fake = CBISinter.fake();
      
      expect(() => new CBISinter(fake.value)).not.toThrow();
    });
  });
});