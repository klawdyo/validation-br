import { PIS } from '../src/pis-pasep';

describe('PIS', () => {
  describe('constructor', () => {
    test.each([
      '71282677380',
      '23795126955',
      '50012973803',
      '27890141144',
      '268.27649.96-0',
      '613.01862.91-7',
    ])('deve estar definido', (input) => {
      expect(new PIS(input)).toBeDefined();
    });

    test.each([
      '712.82677.38-2',
      '237.95126.95-4',
      '500.12973.80-1',
      '278.90141.14-9',
      '268.27649.96-2',
      '613.01862.91-4',
      '111.11111.11-1',
      '', // vazio
      '0613.01862.91-4', // caracteres a mais
      '13.01862.91-4', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro', (input) => {
      expect(() => new PIS(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '71282677380', expected: '712.82677.38-0' },
      { num: '23795126955', expected: '237.95126.95-5' },
      { num: '50012973803', expected: '500.12973.80-3' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
      const masked = new PIS(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^\d{3}.\d{5}.\d{2}-\d{1}$/);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('deve gerar um fake válido', () => {
      const result = PIS.fake();
      expect(result).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '7128267738', expected: '0' },
      { num: '2379512695', expected: '5' },
      { num: '5001297380', expected: '3' },
    ])('%s deve gerar dv correto', (item) => {
      const calcDv = PIS.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

    test.each(['712826778', '71282677381', ''])(
      '%s deve lançar erro de dv',
      (item) => {
        expect(() => PIS.checksum(item)).toThrow();
      }
    );
  });
});
