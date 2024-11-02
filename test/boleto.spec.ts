import { Boleto } from '../src/boleto';

describe('Boleto', () => {
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
