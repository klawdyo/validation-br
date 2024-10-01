import { PixKey, PixKeys } from '../src/pix-key';

describe('Pix', () => {
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
});
