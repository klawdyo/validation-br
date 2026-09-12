import { Boleto } from '../src/boleto';

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

    test('deve lançar erro quando o DV do 1º campo da linha digitável estiver errado', () => {
      const line = Boleto.fake().toString();
      const wrongChecksum = line.substring(0, 9) + String((+line[9] + 1) % 10) + line.substring(10);

      expect(() => new Boleto(wrongChecksum)).toThrow();
    });

    test('deve lançar erro quando o DV do 2º campo da linha digitável estiver errado', () => {
      const line = Boleto.fake().toString();
      const wrongChecksum = line.substring(0, 20) + String((+line[20] + 1) % 10) + line.substring(21);

      expect(() => new Boleto(wrongChecksum)).toThrow();
    });

    test('deve lançar erro quando o DV do 3º campo da linha digitável estiver errado', () => {
      const line = Boleto.fake().toString();
      const wrongChecksum = line.substring(0, 31) + String((+line[31] + 1) % 10) + line.substring(32);

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
      // Os limites da virada de era do fator de vencimento (fev/2025) são testados
      // em detalhe em test/_helpers/expiration-factor.spec.ts; aqui só confirmamos
      // que o Boleto está de fato usando o ExpirationFactor.
      const expiresAt = new Date('2024-01-15T00:00:00.000Z');
      const boleto = Boleto.fake({ expiresAt });

      expect(boleto.expiresAt?.toISOString().substring(0, 10)).toBe('2024-01-15');
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

  // Exemplos reais, extraídos de suítes de teste de outras bibliotecas de
  // boleto open source (não gerados por Boleto.fake()), para validar o
  // Módulo 10, o Módulo 11 e a conversão entre formatos com dados de bancos
  // e décadas diferentes.
  describe('exemplos reais', () => {
    test('Bradesco (237), linha digitável, mascarada e sem máscara', () => {
      // https://github.com/mcrvaz/boleto-brasileiro-validator/blob/master/test/boleto-bancario.js
      const masked = '23793.38128 60007.827136 95000.063305 9 75520000370000';
      const unmasked = '23793381286000782713695000063305975520000370000';

      const boleto = new Boleto(masked);

      expect(boleto.toString()).toBe(unmasked);
      expect(boleto.bank).toBe('237');
      expect(boleto.amount).toBe(3700);
    });

    test('Banco do Brasil (001), código de barras', () => {
      // https://github.com/mcrvaz/boleto-brasileiro-validator/blob/master/test/boleto-bancario.js
      // Exemplo clássico, de bem antes da virada de era do fator de vencimento
      // (fevereiro/2025): o fator 3737 cai na faixa ambígua (< 6000) e por isso
      // é interpretado como era nova aqui, mesmo tendo sido originalmente um
      // vencimento de 1997+3737 dias. Ver ExpirationFactor.toDate().
      const barcode = '00193373700000001000500940144816060680935031';

      const boleto = new Boleto(barcode);

      expect(boleto.toBarcode()).toBe(barcode);
      expect(boleto.bank).toBe('001');
      expect(boleto.amount).toBe(1);
    });

    test('Safra (422), linha digitável', () => {
      // https://github.com/Tagliatti/Boleto-Validator-PHP/blob/master/tests/BoletoValidatorTest.php
      const masked = '42297.11504 00001.954411 60020.034520 2 68610000054659';
      const unmasked = '42297115040000195441160020034520268610000054659';

      const boleto = new Boleto(masked);

      expect(boleto.toString()).toBe(unmasked);
      expect(boleto.bank).toBe('422');
      expect(boleto.amount).toBe(546.59);
      expect(boleto.expiresAt?.toISOString().substring(0, 10)).toBe('2016-07-20');
    });

    test('Caixa (104), código de barras e linha digitável equivalentes', () => {
      // https://github.com/mrmgomes/boleto-utils/blob/master/test/test.js
      // Essa biblioteca calcula as duas interpretações possíveis do fator 8981
      // (era antiga: 2022-05-10; era nova: 2046-12-30) exatamente como este
      // validador calcularia internamente para cada uma das eras -- o que serve
      // de conferência independente das duas datas-base usadas aqui.
      const barcode = '10499898100000214032006561000100040099726390';
      const linha = '10492006506100010004200997263900989810000021403';

      const fromBarcode = new Boleto(barcode);
      const fromLinha = new Boleto(linha);

      expect(fromBarcode.toString()).toBe(linha);
      expect(fromLinha.toBarcode()).toBe(barcode);

      expect(fromBarcode.bank).toBe('104');
      expect(fromBarcode.amount).toBe(214.03);
      // 8981 >= 6000: interpretado como era antiga, que é a data que este
      // boleto de fato tinha (confirmado pela fonte acima).
      expect(fromBarcode.expiresAt?.toISOString().substring(0, 10)).toBe('2022-05-10');
    });
  });
});
