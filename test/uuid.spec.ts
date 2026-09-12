import { UUID } from "../src/uuid";

describe('UUID', () => {
  describe('constructor', () => {
    test('Deve definir um uuid com traços', () => {
      const uuid = new UUID('00000000-0000-4000-8000-000000000000');
      expect(uuid).toBeDefined()
    });

    test('Deve definir um uuid sem traços', () => {
      const uuid = new UUID('00000000000040008000000000000000');
      expect(uuid).toBeDefined()
    });

    test('Deve definir um uuid somente sem o "4" do v4', () => {
      expect(() => new UUID('00000000-0000-0000-8000-000000000000')).toThrow()
    });

    test.each(['0', '1', '2', '3', '4', '5', '6', '7', 'c', 'd', 'e', 'f'])(
      'Deve lançar erro quando o grupo da variante (RFC 4122) não começar com 8, 9, a ou b (recebido: %s)',
      (variantChar) => {
        expect(() => new UUID(`00000000-0000-4000-${variantChar}000-000000000000`)).toThrow()
      }
    );

    test.each(['g', 'x', 'z'])(
      'Deve lançar erro quando houver uma letra não hexadecimal (recebido: %s)',
      (letter) => {
        expect(() => new UUID(`00000000-0000-4000-8000-0000${letter}0000000`)).toThrow()
      }
    );

    test('Deve definir um uuid com grupos com menos caracteres', () => {
      expect(() => new UUID('00000000-0000-4000-8000-00000000000')).toThrow()
    });

    test('Deve definir um uuid com grupos com mais caracteres', () => {
      expect(() => new UUID('00000000-0000-4000-8000-000000000000A')).toThrow()
    });
  });

  describe('fake', () => {
    test('Deve definir um uuid fake', () => {
      const uuid = UUID.fake();
      expect(new UUID(uuid.toString())).toBeDefined()
      expect(new UUID(uuid.value)).toBeDefined()
    });
  });

  describe('mask', () => {
    test('Deve definir a máscara de um uuid sem traços', () => {
      const uuid = new UUID('00000000000040008000000000000000');

      expect(uuid.mask()).toBe('00000000-0000-4000-8000-000000000000')
    });

    test('Deve definir a máscara de um uuid com traços', () => {
      const uuid = new UUID('00000000-0000-4000-8000-000000000000');

      expect(uuid.mask()).toBe('00000000-0000-4000-8000-000000000000')
    });
  });

  describe('toString', () => {
    test('Deve exibir o valor sem o caracteres especiais', () => {
      const uuid = new UUID('00000000-0000-4000-8000-000000000000');

      expect(uuid.toString()).toBe('00000000000040008000000000000000')
      expect(uuid.toString()).toHaveLength(32)

      expect(uuid.value).toBe('00000000000040008000000000000000')
      expect(uuid.value).toHaveLength(32)
    });
  });
});