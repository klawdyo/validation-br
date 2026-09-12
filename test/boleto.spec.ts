import { Boleto } from '../src/boleto';

/**
 * Monta um código de barras válido com um fator de vencimento arbitrário,
 * para testar expirationFactorToDate() isoladamente da geração de fake().
 */
function buildBoletoWithFactor(factor: string): Boleto {
  const bank = '001';
  const currency = '9';
  const amount = '0000000000';
  const freeField = '0'.repeat(25);

  const body = `${bank}${currency}${factor}${amount}${freeField}`;
  const generalChecksum = Boleto.checksum(body);
  const barcode = `${bank}${currency}${generalChecksum}${factor}${amount}${freeField}`;

  return new Boleto(barcode);
}

describe('Boleto', () => {
  describe('constructor', () => {
    test.each([...Array(10)])('deve estar definido a partir da linha digitável', () => {
      const boleto = Boleto.fake();
      const boletoFromLine = new Boleto(boleto.toString());

      expect(boletoFromLine).toBeDefined();
      expect(boletoFromLine.value).toHaveLength(47);
    });

    test.each([...Array(10)])('deve estar definido a partir do código de barras', () => {
      const boleto = Boleto.fake();
      const boletoFromBarcode = new Boleto(boleto.toBarcode());

      expect(boletoFromBarcode).toBeDefined();
      expect(boletoFromBarcode.value).toHaveLength(44);
    });

    test('deve aceitar a linha digitável com pontos e espaços (mascarada)', () => {
      const boleto = Boleto.fake();
      const masked = boleto.mask();

      expect(new Boleto(masked).toString()).toBe(boleto.toString());
    });

    test.each([
      '', // vazio
      null,
      undefined,
      '123', // muito curto
      '1'.repeat(45), // nem 44 nem 47
      '1'.repeat(46), // nem 44 nem 47
      '1'.repeat(48), // nem 44 nem 47
    ])('deve lançar erro de formato para %s', (input) => {
      expect(() => new Boleto(input as unknown as string)).toThrow();
    });

    test('deve lançar erro quando o DV geral do código de barras estiver errado', () => {
      const barcode = Boleto.fake().toBarcode();
      const wrongChecksum = barcode.substring(0, 4) + String((+barcode[4] + 1) % 10) + barcode.substring(5);

      expect(() => new Boleto(wrongChecksum)).toThrow();
    });

    test('deve lançar erro quando um DV de campo da linha digitável estiver errado', () => {
      const line = Boleto.fake().toString();
      const wrongChecksum = line.substring(0, 9) + String((+line[9] + 1) % 10) + line.substring(10);

      expect(() => new Boleto(wrongChecksum)).toThrow();
    });

    test('deve lançar erro quando o DV geral (campo 4) da linha digitável estiver errado', () => {
      const line = Boleto.fake().toString();
      const wrongChecksum = line.substring(0, 32) + String((+line[32] + 1) % 10) + line.substring(33);

      expect(() => new Boleto(wrongChecksum)).toThrow();
    });
  });

  describe('toBarcode / toString', () => {
    test('a conversão entre linha digitável e código de barras deve ser reversível', () => {
      const boleto = Boleto.fake();
      const barcode = boleto.toBarcode();
      const line = boleto.toString();

      expect(new Boleto(barcode).toString()).toBe(line);
      expect(new Boleto(line).toBarcode()).toBe(barcode);
    });
  });

  describe('mask', () => {
    test('deve mascarar a linha digitável no formato 00000.00000 00000.000000 00000.000000 0 00000000000000', () => {
      const boleto = Boleto.fake();

      expect(boleto.mask()).toMatch(
        /^\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d \d{14}$/
      );
      expect(boleto.mask().replace(/\D/g, '')).toBe(boleto.toString());
    });
  });

  describe('bank / amount / expiresAt / freeField', () => {
    test('deve expor os campos comuns corretamente', () => {
      const boleto = Boleto.fake({ bank: '001', amount: 123.45 });

      expect(boleto.bank).toBe('001');
      expect(boleto.amount).toBe(123.45);
      expect(boleto.freeField).toHaveLength(25);
    });

    test('deve devolver expiresAt como null quando o fator de vencimento for "0000"', () => {
      const barcode = Boleto.fake().toBarcode();
      const withoutExpiration = `${barcode.substring(0, 5)}0000${barcode.substring(9, 19)}${barcode.substring(19)}`;
      const generalChecksum = Boleto.checksum(
        withoutExpiration.substring(0, 4) + withoutExpiration.substring(5)
      );
      const fixedBarcode = `${withoutExpiration.substring(0, 4)}${generalChecksum}${withoutExpiration.substring(5)}`;

      expect(new Boleto(fixedBarcode).expiresAt).toBeNull();
    });

    test('deve calcular expiresAt a partir do fator de vencimento informado', () => {
      const expiresAt = new Date('2024-01-15T00:00:00.000Z');
      const boleto = Boleto.fake({ expiresAt });

      expect(boleto.expiresAt?.toISOString().substring(0, 10)).toBe('2024-01-15');
    });

    describe('virada de era do fator de vencimento (21-22/02/2025)', () => {
      test.each([
        { factor: '0000', expected: null },
        { factor: '0100', expected: '2022-09-06' }, // menor que 6000: era nova (não a antiga, mesmo sendo um fator baixo)
        { factor: '5999', expected: '2038-10-31' }, // menor que 6000: era nova
        { factor: '1000', expected: '2025-02-22' }, // início da era nova
        { factor: '6000', expected: '2014-03-12' }, // maior ou igual a 6000: era antiga
        { factor: '9999', expected: '2025-02-21' }, // fim da era antiga
      ])('fator $factor deve corresponder a $expected', ({ factor, expected }) => {
        const boleto = buildBoletoWithFactor(factor);

        if (expected === null) {
          expect(boleto.expiresAt).toBeNull();
        } else {
          expect(boleto.expiresAt?.toISOString().substring(0, 10)).toBe(expected);
        }
      });
    });

    describe('escolha de era ao converter uma data em fator de vencimento', () => {
      test.each([
        { date: '2020-06-15', description: 'antes da virada' },
        { date: '2025-02-21', description: 'último dia da era antiga' },
        { date: '2025-02-22', description: 'primeiro dia da era nova' },
        { date: '2030-05-10', description: 'depois da virada' },
      ])('deve fazer o round-trip corretamente para uma data $description ($date)', ({ date }) => {
        const boleto = Boleto.fake({ expiresAt: new Date(`${date}T00:00:00.000Z`) });

        expect(boleto.expiresAt?.toISOString().substring(0, 10)).toBe(date);
      });
    });
  });

  describe('fromBarcode', () => {
    test('deve ser equivalente a chamar o construtor com o código de barras', () => {
      const barcode = Boleto.fake().toBarcode();

      expect(Boleto.fromBarcode(barcode).toBarcode()).toBe(barcode);
    });
  });

  describe('checksum', () => {
    test('deve calcular o DV geral a partir dos 43 dígitos sem o DV', () => {
      const barcode = Boleto.fake().toBarcode();
      const body = barcode.substring(0, 4) + barcode.substring(5);

      expect(Boleto.checksum(body)).toBe(barcode.substring(4, 5));
    });

    test.each([
      '',
      null,
      undefined,
      '123', // muito curto
      '1'.repeat(44), // 1 a mais
    ])('deve lançar erro para %s', (input) => {
      expect(() => Boleto.checksum(input as unknown as string)).toThrow();
    });
  });

  describe('fake', () => {
    test.each([...Array(10)])('deve gerar um boleto válido', () => {
      const boleto = Boleto.fake();

      expect(boleto).toBeDefined();
      expect(boleto.toString()).toHaveLength(47);
      expect(boleto.toBarcode()).toHaveLength(44);
    });

    test('deve aceitar banco fixo', () => {
      expect(Boleto.fake({ bank: '341' }).bank).toBe('341');
    });

    test('deve aceitar valor fixo', () => {
      expect(Boleto.fake({ amount: 1500.5 }).amount).toBe(1500.5);
    });
  });
});
