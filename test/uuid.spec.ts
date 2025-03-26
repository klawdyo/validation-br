import { UUID } from "../src/uuid";

describe('UUID', () => {
  describe('constructor', () => {
    test('Deve definir um uuid com traços', () => {
      const uuid = new UUID('00000000-0000-4000-0000-000000000000');
      expect(uuid).toBeDefined()
    });

    test('Deve definir um uuid sem traços', () => {
      const uuid = new UUID('00000000000040000000000000000000');
      expect(uuid).toBeDefined()
    });

    test('Deve definir um uuid somente sem o "4" do v4', () => {
      expect(()=>new UUID('00000000-0000-0000-0000-000000000000')).toThrow()
    });

    test('Deve definir um uuid com letras não hexadecimais', () => {
      expect(()=>new UUID('00000000-0000-0000-0000-0000X0000000')).toThrow()
    });

    test('Deve definir um uuid com grupos com menos caracteres', () => {
      expect(()=>new UUID('00000000-0000-0000-0000-00000000000')).toThrow()
    });

    test('Deve definir um uuid com grupos com mais caracteres', () => {
      expect(()=>new UUID('00000000-0000-0000-0000-000000000000A')).toThrow()
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
      const uuid = new UUID('00000000000040000000000000000000');
      console.log('Mask()', uuid.mask());
      expect(uuid.mask()).toBe('00000000-0000-4000-0000-000000000000')
    });

    test('Deve definir a máscara de um uuid com traços', () => {
      const uuid = new UUID('00000000-0000-4000-0000-000000000000');
      console.log('Mask()', uuid.mask());
      expect(uuid.mask()).toBe('00000000-0000-4000-0000-000000000000')
    });
  });
});