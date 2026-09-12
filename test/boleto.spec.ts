import { Boleto } from '../src/boleto';

// WIP: validate()/checksum() ainda não implementados (lançam "Not implemented").
// Reative quando o cálculo do dígito verificador do boleto estiver pronto.
describe.skip('Boleto', () => {
  describe('constructor', () => {
    test('deve estar definido', () => {
      const line = '07790.00116 12064.449908 08159.365561 7 90020000015130';
      console.log(new Boleto(line));
    });
  });

  describe('fromBarcode', () => {
    test('deve estar definido', () => {
      const line = '07797900200000151300001112064449900815936556';
      console.log(new Boleto(line));
    });
  });
});
