import { JudicialProcess } from '../src/judicial-process';
import { insertAtPosition } from '../src/utils';

describe('JudicialProcess', () => {
  describe('constructor', () => {
    test.each([
      '6105283-83.2009.8.13.0024',
      '00110060720168200100',
      '08002785520134058400',
      '08002732820164058400',
    ])('deve estar definido', (input) => {
      // console.log(new JudicialProcess(input));
      const proc = new JudicialProcess(input)
      expect(proc).toBeDefined();
      expect(proc.processNumber).toBe(input.replace(/\D/g, '').substring(0, 7))
    });

    test.each([
      '0110060720168200100', // caractere a menos
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
      { num: '000208020125150049', dv: '25' },
      { num: '610528320098130024', dv: '83' },
      { num: '001100620168200100', dv: '07' },
      { num: '080027820134058400', dv: '55' },
      { num: '080027320164058400', dv: '28' },
    ])('dv() - Verificando se o DV gerado está correto', (item) => {
      const calcDv = JudicialProcess.checksum(item.num);

      expect(calcDv).toBe(item.dv);
      expect(typeof calcDv).toBe('string');

      // Preenche número do processo com o seu DV
      const full = insertAtPosition(item.num, item.dv, 7)
      expect(new JudicialProcess(full).checksum).toBe(item.dv)

    });


    test.each(['0002080201251500499', '00020802012515004', ''])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => JudicialProcess.checksum(item)).toThrow();
      }
    );
  });

  describe('toString', () => {
    test.each([
      { input: '6105283-83.2009.8.13.0024', expected: '61052838320098130024', },
      { input: '00110060720168200100', expected: '00110060720168200100', },
      { input: '08002785520134058400', expected: '08002785520134058400', },
      { input: '08002732820164058400', expected: '08002732820164058400', },
    ])('deve exibir o valor sem caracteres especiais', (input) => {
      
      const proc = new JudicialProcess(input.input)
      
      expect(proc.toString()).toBe(input.expected)
      expect(proc.toString()).toHaveLength(20)
      
      expect(proc.value).toBe(input.expected)
      expect(proc.value).toHaveLength(20)
    });


  });

  describe('getWithoutChecksum', () => {
    test('Deve pegar o número completo do processo sem o DV', () => {
      // expect(new JudicialProcess('00020802520125150049').)
      expect(JudicialProcess.getWithoutChecksum('00020802520125150049')).toBe('000208020125150049')
      expect(JudicialProcess.getWithoutChecksum('000208020125150049')).toBe('000208020125150049')
      expect(() => JudicialProcess.getWithoutChecksum('00020802012515004')).toThrow()
    });
  })

  describe('getFakeSubCourt', () => {
    test('Deve pegar aleatoriamente uma subcorte', () => {
      // se informar zero, use 01
      expect(JudicialProcess.getFakeSubCourt('0')).toBe('01')
      expect(JudicialProcess.getFakeSubCourt('00')).toBe('01')
      // vazio calcula um aleatorio
      expect(JudicialProcess.getFakeSubCourt('').length).toBe(2)
      expect(JudicialProcess.getFakeSubCourt(null as any).length).toBe(2)
      expect(JudicialProcess.getFakeSubCourt(undefined as any).length).toBe(2)
      // se informar um válido, use ele mesmo
      expect(JudicialProcess.getFakeSubCourt('02')).toBe('02')
      // se informar um inválido, use 01
      expect(JudicialProcess.getFakeSubCourt('345')).toBe('01')

      const fake = JudicialProcess.getFakeSubCourt();

      expect(fake.length).toBe(2);
      expect(fake >= '01').toBeTruthy();
      expect(fake <= '99').toBeTruthy();
    });
  })
});
