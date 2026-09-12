import { CAEPF } from '../src/caepf';

describe('CAEPF', () => {
  describe('constructor', () => {
    test.each([
      // https://github.com/VitorLuizC/brazilian-values/blob/master/test/validators.test.ts
      '411.422.600/001-01',
      '41142260000101',
      '457.231.740/001-22',
      '123456789001-00', // sem toda a máscara
      '98765432100234',
      '55544433301063',
      '70012345609998',
    ])('deve estar definido', (input) => {
      expect(new CAEPF(input)).toBeDefined();
    });

    test.each([
      '411.422.600/001-00', // DV errado
      '41142260000199',
      '11111111111111', // repetido
      '', // vazio
      '411422600001010', // caracteres a mais
      '4114226000101', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro', (input) => {
      expect(() => new CAEPF(input as unknown as string)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '41142260000101', expected: '411.422.600/001-01' },
      { num: '98765432100234', expected: '987.654.321/002-34' },
      { num: '55544433301063', expected: '555.444.333/010-63' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
      const masked = new CAEPF(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toHaveLength(18);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
      const caepf = CAEPF.fake();
      expect(caepf).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '411422600001', expected: '01' },
      { num: '457231740001', expected: '22' },
      { num: '123456789001', expected: '00' },
      { num: '987654321002', expected: '34' },
      { num: '555444333010', expected: '63' },
      { num: '700123456099', expected: '98' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = CAEPF.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

    test.each(['41142260', '1234567890012', ''])(
      '%s deve lançar erro de dv',
      (item) => {
        expect(() => CAEPF.checksum(item)).toThrow();
      }
    );
  });

  describe('toString', () => {
    test('Deve exibir o valor sem os caracteres especiais', () => {
      const caepf = new CAEPF('411.422.600/001-01');

      expect(caepf.toString()).toBe('41142260000101')
      expect(caepf.toString()).toHaveLength(14)

      expect(caepf.value).toBe('41142260000101')
      expect(caepf.value).toHaveLength(14)
    });
  });
});
