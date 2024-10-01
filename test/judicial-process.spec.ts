import { JudicialProcess } from '../src/judicial-process';

describe('JudicialProcess', () => {
  describe('constructor', () => {
    test.each([
      '6105283-83.2009.8.13.0024',
      '00110060720168200100',
      '08002785520134058400',
      '08002732820164058400',
    ])('deve estar definido', (input) => {
      // console.log(new JudicialProcess(input));

      expect(new JudicialProcess(input)).toBeDefined();
    });

    test.each([
      '0110060720168200100',
      '61052838320098130023',
      '00110060720168200102',
      '08002785520134058401',
      '08002732820164058406',
      '08002732820160058400', // Órgão judiciário igual a 0
      '', // vazio
      '008002732820160058400', // caracteres a mais
      '8002732820160058400', // caracteres a menos
      null,
      undefined,
    ])('deve lançar erro %s', (input) => {
      expect(() => new JudicialProcess(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: '00020802520125150049', expected: '0002080-25.2012.5.15.0049' },
      { num: '61052838320098130024', expected: '6105283-83.2009.8.13.0024' },
      { num: '00110060720168200100', expected: '0011006-07.2016.8.20.0100' },
      { num: '08002785520134058400', expected: '0800278-55.2013.4.05.8400' },
      { num: '08002732820164058400', expected: '0800273-28.2016.4.05.8400' },
    ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
      const masked = new JudicialProcess(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^\d{7}-\d{2}.\d{4}.\d.\d{2}.\d{4}$/);
    });
  });

  describe('fake()', () => {
    test.each([...Array(5)])('Deve gerar um fake válido', () => {
      const result = JudicialProcess.fake();
      expect(result).toBeDefined();
    });

    test.each([...Array(5)])(
      'Deve gerar um fake válido com o órgão definido',
      () => {
        const result = JudicialProcess.fake({ court: '3' });
        expect(result).toBeDefined();
        expect(result.court).toBe('3');
      }
    );

    test.each([...Array(5)])(
      'Deve gerar um fake válido com o tribunal definido',
      () => {
        const result = JudicialProcess.fake({ subCourt: '13' });
        expect(result).toBeDefined();
        expect(result.subCourt).toBe('13');
      }
    );

    test.each([...Array(5)])(
      'Deve gerar um fake válido com o ano definido',
      () => {
        const result = JudicialProcess.fake({ year: '2024' });
        expect(result).toBeDefined();
        expect(result.year).toBe('2024');
      }
    );

    test.each([...Array(5)])(
      'Deve gerar um fake válido com a unidade de origem definida',
      () => {
        const result = JudicialProcess.fake({ origin: '1313' });
        expect(result).toBeDefined();
        expect(result.origin).toBe('1313');
      }
    );

    test.each([
      { court: '0' },
      { court: '11' },
      { subCourt: '1' },
      { subCourt: '00' },
      { subCourt: '111' },
      { year: '111' },
      { year: '11111' },
      { origin: '0000' },
      { origin: '111' },
      { origin: '11111' },
    ])(
      'Deve lançar erro quando tenta criar fake com valores pré-definidos inválidos %s',
      (input) => {
        expect(() => JudicialProcess.fake(input)).toThrow();
      }
    );
  });

  describe('checksum', () => {
    test.each([
      { num: '000208020125150049', expected: '25' },
      { num: '610528320098130024', expected: '83' },
      { num: '001100620168200100', expected: '07' },
      { num: '080027820134058400', expected: '55' },
      { num: '080027320164058400', expected: '28' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = JudicialProcess.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

        
    test.each(['0002080201251500499', '00020802012515004', ''])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => JudicialProcess.checksum(item)).toThrow();
      }
    );
  });
});
