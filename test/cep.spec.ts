import { CEP } from '../src/cep';
import { UF } from '../src/uf';

describe('CEP', () => {
  describe('constructor', () => {
    test.each(['59650000', '59650-000', '59.650-000'])(
      '%s deve estar definido',
      (input) => {
        expect(new CEP(input)).toBeDefined();
      }
    );

    test.each([
      '5965000A', // letras
      '596000', // caracteres de menos
      '596500000', // caracteres de mais
      '5965-0000', // hífen fora do lugar
      '59.650000', // tem ponto mas não tem traço
    ])('%s deve lançar erro', (input) => {
      expect(() => new CEP(input)).toThrow();
    });
  });

  describe('constructor com validação por estado', () => {
    test.each(['59650000', '59650-000', '59.650-000'])(
      '%s deve estar definido',
      (input) => {
        expect(new CEP(input, { uf: UF.RN })).toBeDefined();
      }
    );

    test.each(['59650000', '59650-000', '59.650-000'])(
      '%s deve lançar erro pois não é um CEP do Ceará',
      (input) => {
        expect(() => new CEP(input, { uf: UF.CE })).toThrow();
      }
    );
  });

  describe('toString', () => {
    test.each(['59650000', '59650-000'])(
      'CEP %s deve ser exibido sem máscara',
      (value) => {
        expect(new CEP(value).toString()).toBe('59650000');
        expect(new CEP(value).value).toBe('59650000');
      }
    );
  });

  describe('fake', () => {
    test.each([...Array(5)])('Gera fake válido', () => {
      const cep = CEP.fake();
      expect(cep).toBeDefined();
      expect(cep.value).toHaveLength(8);
    });

    test.each([...Array(5)])('Gera fake válido por estado', () => {
      const cep = CEP.fake({ uf: UF.RN });
      expect(cep).toBeDefined();
      expect(cep.value).toHaveLength(8);
      expect(cep.value >= '59000000').toBeTruthy();
      expect(cep.value <= '59999999').toBeTruthy();
    });
  });

  describe('checksum', () => {
    test('deve lançar erro pois cep não tem dígito verificador', () => {
      expect(() => CEP.checksum('59650000')).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { value: '95471143', expected: '95471-143' },
      { value: '16474534', expected: '16474-534' },
      { value: '44471146', expected: '44471-146' },
    ])('%s deve gerar máscara corretamente', (input) => {
      const cep = new CEP(input.value);

      expect(cep.mask()).toBe(input.expected);
      expect(cep.mask()).toHaveLength(9);
      expect(cep.mask()).toMatch(/^\d{5}-\d{3}$/);
    });
  });

  //
  //
  //
  // SPECIFIC
  //
  //
  //

  describe('getUFByCEP', () => {
    test.each(['59650000', '59650-000', '59.650-000'])(
      'O CEP de Assú deve retornar RN',
      (item) => {
        const uf = CEP.getUFByCEP(item);
        expect(uf).toBeDefined();
        expect(uf).toBeInstanceOf(UF);
        expect(uf.value).toBe('RN');
      }
    );

    test.each(['01123456', '01123-456', '01.123-456'])(
      'Verifica CEPs de São Paulo para testar o "0" inicial',
      (item) => {
        const uf = CEP.getUFByCEP(item);
        expect(uf).toBeDefined();
        expect(uf).toBeInstanceOf(UF);
        expect(uf.value).toBe('SP');
      }
    );

    test('Deve retornar erro para um CEP não encontrado', () => {
      expect(() => CEP.getUFByCEP('00123456')).toThrow()
    }
    );
  });

  describe('getRandomByUF', () => {
    test('Deve gerar um CEP aleatório dentro da faixa do RN', () => {
      const cep = CEP.getRandomByUF(UF.RN);
      expect(cep).toBeDefined();
      expect(cep.value >= '59000000').toBeTruthy();
      expect(cep.value <= '59999999').toBeTruthy();
    });
  });

  describe('getRangesByUF', () => {
    test.each(['59650000', '59650-000', '59.650-000'])(
      'Pega as faixas do RN',
      () => {
        const [ranges] = CEP.getRangesByUF(UF.RN);
        expect(ranges).toBeDefined();
        expect(ranges).toMatchObject(['59000000', '59999999']);
      }
    );
  });
});
