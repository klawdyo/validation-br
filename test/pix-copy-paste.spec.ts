// pix usado pelo 10 pila.

import { PixCopyPaste } from '../src/pix-copy-paste';

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
      expect(()=>new PixCopyPaste(copyPaste)).toThrow()
    });
  });

  describe('parse', () => {
    test.each(cases)('testa o parse', (input) => {
      const parse = PixCopyPaste.parse(input);
      
      expect(parse).toBeDefined();
      expect(Array.isArray(parse)).toBeTruthy();
    });
  });
});

