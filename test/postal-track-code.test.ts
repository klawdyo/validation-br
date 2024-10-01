import { PostalTrackCode } from '../src/postal-track-code';

describe('PostalTrackCode', () => {
  describe('constructor', () => {
    test.each([
      'PN718252423BR',
      'PO925539762BR',
      'JT194690698BR',
      'SV143851674BR',
      'RG727348650CN',
      'RY747622885CN',
      'RY728187035CN',
      'RH940629235CN',
      'RY686586175CN',
      'RY648001205CN',
      'UJ776469464CN',
      'LZ667841882CN',
      'RS737783818NL',
    ])('%s deve estar definido', (input) => {
      expect(new PostalTrackCode(input)).toBeDefined();
    });

    test.each([
      'PO925524762BR', // dv inválido
      'JT194624698BR', // dv inválido
      'SV143824674BR', // dv inválido
      'RG727324650CN', // dv inválido
      'RY747624885CN', // dv inválido
      'RY728114035CN', // dv inválido
      'RY728114035', // sem letras no final
      'RY728114035N', // 1 letra no final
      'RS737783818NLL', // 3 letras no final
      '737783818NL', // sem letra no começo
      'S737783818NL', // só 1 letra no começo
      'ARS737783818NL', // 3 letras no começo
      'RS73778381NL', // numero a menos
      null,
      undefined,
    ])('%s deve lançar erro', (input) => {
      expect(() => new PostalTrackCode(input as any)).toThrow();
    });
  });

  describe('mask', () => {
    test.each([
      { num: 'pn718252423br', expected: 'PN718252423BR' },
      { num: 'po925539762br', expected: 'PO925539762BR' },
      { num: 'jt194690698br', expected: 'JT194690698BR' },
    ])('Deve aplicar a máscara corretamente', (item) => {
      const masked = new PostalTrackCode(item.num).mask();

      expect(masked).toBe(item.expected);
      expect(masked).toMatch(/^[A-Z]{2}\d{9}[A-Z]{2}$/);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('deve gerar fakes válidos', () => {
      const result = PostalTrackCode.fake();
      expect(result).toBeDefined();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '71825242', expected: '3' },
      { num: '92553976', expected: '2' },
      { num: '19469069', expected: '8' },
    ])('Deve calcular o Dv corretamente', (item) => {
      const calcDv = PostalTrackCode.checksum(item.num);

      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });

    test.each(['PN718252423BR', '925539762BR', 'JT194690698'])(
      'Deve lançar erro',
      (item) => {
        expect(() => PostalTrackCode.checksum(item)).toThrow();
      }
    );
  });
});
