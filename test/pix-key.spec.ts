import { PixKey, PixKeys } from '../src/pix-key';

describe('PixKey', () => {
  describe('constructor', () => {
    test('deve estar definido do tipo e-mail', () => {
      const key = new PixKey('klawdyo@gmail.com');
      expect(key).toBeDefined();
      expect(key.type).toBe(PixKeys.email);
    });

    test('deve estar definido do tipo cpf', () => {
      const key = new PixKey('004.129.620-63');
      expect(key).toBeDefined();
      expect(key.type).toBe(PixKeys.cpf);
    });

    test('deve estar definido do tipo cnpj', () => {
      const key = new PixKey('41356581000186');
      expect(key).toBeDefined();
      expect(key.type).toBe(PixKeys.cnpj);
    });

    test('deve estar definido do tipo aleatória', () => {
      const key = new PixKey('01234567-0123-4567-8901-234567890123');
      expect(key).toBeDefined();
      expect(key.type).toBe(PixKeys.evp);
    });

    test('deve estar definido do tipo phone', () => {
      const key = new PixKey('+5584987654321');
      expect(key).toBeDefined();
      expect(key.type).toBe(PixKeys.phone);
    });

    test('deve falhar ao receber um telefone inválido', () => {
      expect(() => new PixKey('+55849876')).toThrow()
    });
  });

  describe('Máscara', () => {
    test('Deve retornar o mesmo valor', () => {
      const input = 'klawdyo@gmail.com';
      // const masked = 
      expect(new PixKey(input).mask()).toBe(input);
    });
  });

  describe('Fake', () => {
    test('Deve retornar um valor fake que é um email', () => {
      const value = PixKey.fake({ type: PixKeys.email });
      expect(value.type).toBe(PixKeys.email);
    });
    test('Deve retornar um valor fake que é um cpf', () => {
      const value = PixKey.fake({ type: PixKeys.cpf });
      expect(value.type).toBe(PixKeys.cpf);
    });
    test('Deve retornar um valor fake que é um cnpj', () => {
      const value = PixKey.fake({ type: PixKeys.cnpj });
      expect(value.type).toBe(PixKeys.cnpj);
    });
    test('Deve retornar um valor fake que é um phone', () => {
      const value = PixKey.fake({ type: PixKeys.phone });
      expect(value.type).toBe(PixKeys.phone);
    });
    test('Deve retornar um valor fake que é um evp', () => {
      const value = PixKey.fake({ type: PixKeys.evp });
      expect(value.type).toBe(PixKeys.evp);
    });

    test.each([...Array(100)])('Deve criar uma chave fake válida', () => {
      const value = PixKey.fake().toString();
      expect(new PixKey(value)).toBeDefined();
    });
  });
});
