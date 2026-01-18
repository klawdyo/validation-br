import { Crockford } from '../../src/_helpers/crockford';

describe('Crockford', () => {
  describe('normalize()', () => {
    test('Deve normalizar a string removendo hífens e espaços', () => {
      expect(Crockford.normalize('a3n8z4l-o')).toBe('A3N8Z410');
    });

    test('Deve converter para maiúsculas', () => {
      expect(Crockford.normalize('abc')).toBe('ABC');
    });

    test('Deve substituir I e L por 1', () => {
      expect(Crockford.normalize('AIL')).toBe('A11');
    });

    test('Deve substituir O por 0', () => {
      expect(Crockford.normalize('FOO')).toBe('F00');
    });

    test('Deve remover pontos e hífens', () => {
      expect(Crockford.normalize('A.3-N')).toBe('A3N');
    });

    test('Deve remover espaços', () => {
      expect(Crockford.normalize('A 3 N')).toBe('A3N');
    });

    test('Deve retornar string vazia para entrada vazia', () => {
      expect(Crockford.normalize('')).toBe('');
    });

    test('Deve lançar erro para caractere proibido U', () => {
      expect(() => Crockford.normalize('A3U8Z4F')).toThrow('O caractere \'U\' é proibido no padrão CIB/SINTER para evitar palavras obscenas.');
    });
  });

  describe('charToInt()', () => {
    test('Deve converter caracteres numéricos corretamente', () => {
      expect(Crockford.charToInt('0')).toBe(0);
      expect(Crockford.charToInt('9')).toBe(9);
    });

    test('Deve converter caracteres alfabéticos corretamente', () => {
      expect(Crockford.charToInt('A')).toBe(10);
      expect(Crockford.charToInt('Y')).toBe(30);
      expect(Crockford.charToInt('Z')).toBe(31);
    });

    test('Deve converter caracteres minúsculos após normalização', () => {
      expect(Crockford.charToInt('a')).toBe(10);
      expect(Crockford.charToInt('y')).toBe(30);
    });

    test('Deve substituir I e L por 1 antes da conversão', () => {
      expect(Crockford.charToInt('I')).toBe(1);
      expect(Crockford.charToInt('L')).toBe(1);
    });

    test('Deve substituir O por 0 antes da conversão', () => {
      expect(Crockford.charToInt('O')).toBe(0);
    });

    test('Deve lançar erro para múltiplos caracteres', () => {
      expect(() => Crockford.charToInt('AB')).toThrow('Deve ser fornecido apenas um caractere.');
    });

    test('Deve lançar erro para caractere inválido', () => {
      expect(() => Crockford.charToInt('?')).toThrow('Caractere \'?\' não pertence ao alfabeto Crockford Base32.');
    });

    test('Deve lançar erro para caractere proibido U', () => {
      expect(() => Crockford.charToInt('U')).toThrow('O caractere \'U\' é proibido no padrão CIB/SINTER para evitar palavras obscenas.');
    });
  });

  describe('intToChar()', () => {
    test('Deve converter valores numéricos para caracteres', () => {
      expect(Crockford.intToChar(0)).toBe('0');
      expect(Crockford.intToChar(9)).toBe('9');
      expect(Crockford.intToChar(10)).toBe('A');
      expect(Crockford.intToChar(30)).toBe('Y');
      expect(Crockford.intToChar(31)).toBe('Z');
    });

    test('Deve lançar erro para valor menor que 0', () => {
      expect(() => Crockford.intToChar(-1)).toThrow('O valor deve estar entre 0 e 31 para conversão em Base32.');
    });

    test('Deve lançar erro para valor maior que 31', () => {
      expect(() => Crockford.intToChar(32)).toThrow('O valor deve estar entre 0 e 31 para conversão em Base32.');
    });
  });
});