// pix usado pelo 10 pila.

import { PixCopyPaste, PixPart } from '../src/pix-copy-paste';

// esse pix é um pix automatico
const pixStone = `00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/b411f5c8-e97f-4a18-af0e-fc66491748d7520400005303986540510.005802BR5925DIOGO DA SILVA SANTOS LTD6014RIO DE JANEIRO622905251e3afd7926983f8ffe086cdc16304FF60`;
const pixManual = `00020126550014BR.GOV.BCB.PIX0123alexandrepato@gmail.com0206almoco5204000053039865406100.005802BR5914Alexandre Pato6009Ipanguacu61085950800062490511PIXJS76657250300017BR.GOV.BCB.BRCODE01051.0.0630455CF`;

const cases = [
  pixStone,
  pixManual
]


describe('PixCopyPaste', () => {
  describe('constructor', () => {
    test.each(cases)('deve estar definido', (input) => {
      const pix = new PixCopyPaste(input);
      expect(pix).toBeDefined();
    });

    test('deve lançar um erro ao injetar um caractere na terceira posição', () => {
      const copyPaste = pixStone.slice(0, 4) + 'D' + pixStone.slice(4);
      expect(() => new PixCopyPaste(copyPaste)).toThrow()
    });

    test('deve lançar um erro quando o último campo não for o CRC (código 63)', () => {
      // Mesmo pixManual, mas o último campo tem código 64 em vez de 63 (CRC recalculado para o novo conteúdo)
      const mutated = '00020126550014BR.GOV.BCB.PIX0123alexandrepato@gmail.com0206almoco5204000053039865406100.005802BR5914Alexandre Pato6009Ipanguacu61085950800062490511PIXJS76657250300017BR.GOV.BCB.BRCODE01051.0.06404D05F';
      expect(() => new PixCopyPaste(mutated)).toThrow()
    });

    test('deve lançar um erro quando o campo CRC (63) não tiver tamanho 4', () => {
      // Mesmo pixManual, com um campo extra (99) antes do CRC, e o CRC (63) declarado com tamanho 3
      const mutated = '00020126550014BR.GOV.BCB.PIX0123alexandrepato@gmail.com0206almoco5204000053039865406100.005802BR5914Alexandre Pato6009Ipanguacu61085950800062490511PIXJS76657250300017BR.GOV.BCB.BRCODE01051.0.0990146303DEB';
      expect(() => new PixCopyPaste(mutated)).toThrow()
    });

    test('deve lançar um erro quando PixPart.parse não retornar um array', () => {
      const spy = vi.spyOn(PixPart, 'parse').mockReturnValueOnce(null as unknown as ReturnType<typeof PixPart.parse>);

      expect(() => new PixCopyPaste(pixStone)).toThrow();

      spy.mockRestore();
    });
  });

  describe('PixPart', () => {
    describe('parse', () => {
      test.each(cases)('testa o parse', (input) => {
        const parse = PixPart.parse(input);

        expect(parse).toBeDefined();
        expect(Array.isArray(parse)).toBeTruthy();
      });

      test('deve lançar um erro para evitar loop infinito quando o campo não avança', () => {
        // 'acvs' não começa com 4 dígitos, então getPart devolve o mesmo "rest" recebido
        expect(() => PixPart.parse('acvs')).toThrow();
      });
    });

    describe('getPart', () => {
      test.each([
        '', // vazio
        '123', // menos de 3 números
        'acvs', // não começa com 4 números

      ])('deve retornar um valor padrão', (part) => {
        const expected = { part, code: '', size: 0, value: '', rest: part, children: [] }
        expect(PixPart.getPart(part)).toMatchObject(expected);
      });

      test.each([
        '0002a', // a partir do quinto valor não tem o mesmo tamanho definido nas posições 3 e 4
      ])('deve retornar um erro', (part) => {
        expect(() => PixPart.getPart(part)).toThrow();
      });
    });
  });
});

