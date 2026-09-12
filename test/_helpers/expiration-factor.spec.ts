import { ExpirationFactor } from '../../src/_helpers/expiration-factor';

describe('ExpirationFactor', () => {
  describe('toDate', () => {
    test('deve devolver null quando o fator for "0000"', () => {
      expect(ExpirationFactor.toDate('0000')).toBeNull();
    });

    test.each([
      { factor: '0100', expected: '2022-09-06' }, // menor que 6000: era nova (não a antiga, mesmo sendo um fator baixo)
      { factor: '1000', expected: '2025-02-22' }, // início da era nova
      { factor: '5999', expected: '2038-10-31' }, // menor que 6000: era nova
      { factor: '6000', expected: '2014-03-12' }, // maior ou igual a 6000: era antiga
      { factor: '9999', expected: '2025-02-21' }, // fim da era antiga
    ])('fator $factor deve corresponder a $expected', ({ factor, expected }) => {
      expect(ExpirationFactor.toDate(factor)?.toISOString().substring(0, 10)).toBe(expected);
    });
  });

  describe('fromDate', () => {
    test.each([
      { date: '2020-06-15', description: 'antes da virada' },
      { date: '2025-02-21', description: 'último dia da era antiga' },
      { date: '2025-02-22', description: 'primeiro dia da era nova' },
      { date: '2030-05-10', description: 'depois da virada' },
    ])('deve fazer o round-trip corretamente para uma data $description ($date)', ({ date }) => {
      const factor = ExpirationFactor.fromDate(new Date(`${date}T00:00:00.000Z`));

      expect(ExpirationFactor.toDate(factor)?.toISOString().substring(0, 10)).toBe(date);
    });
  });
});
