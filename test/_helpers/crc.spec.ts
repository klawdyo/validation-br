import { CRC } from '../../src/_helpers/crc';

describe('CRC', () => {
  test('Converte string para o formato CRC16', () => {
    // console.log(CRC(12345678))
    expect(new CRC('12345678').calculate()).toBe('A12B');
    expect(
      new CRC(
        '00020101021226390014BR.GOV.BCB.PIX0117klawdyo@gmail.com52040000530398654041.005802BR5924Jose Claudio Medeiros de6006AssuRN61085965000062200516SINASEFE-18/20216304'
      ).calculate()
    ).toBe('EB13');
  });
});
