import isPIS, { dv, fake, mask, unmask, validate, validateOrFail } from '../src/pisPasep';
import * as _pisPasep from '../src/pisPasep';

describe('PIS', () => {
  test.each([
    // string
    '71282677380',
    '23795126955',
    // integer
    50012973803,
    27890141144,
    // masked
    '268.27649.96-0',
    '613.01862.91-7',
  ])('isPIS() - Números válidos', (item) => {
    expect(isPIS(item)).toBeTruthy();
    expect(_pisPasep.validate(item)).toBeTruthy();
  });

  test.each([
    // string
    '71282677380',
    '23795126955',
    // integer
    50012973803,
    27890141144,
    // masked
    '268.27649.96-0',
    '613.01862.91-7',
  ])('validate() - Números válidos', (item) => {

    expect(validate(item)).toBeTruthy();
  });

  test.each([
    // string
    '712826773809',
    '237951269559',
    // integer
    500129738039,
    278901411449,
    // masked
    '268.27649.96-09',
    '613.01862.91-79',
  ])('validate() - Números válidos com caracteres adicionais', (item) => {

    expect(validate(item)).toBeFalsy();
  });

  test.each([
    '712.82677.38-2',
    '237.95126.95-4',
    '500.12973.80-1',
    '278.90141.14-9',
    '268.27649.96-2',
    '613.01862.91-4',
    '111.11111.11-1',
  ])('validate() - Números inválidos', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test.each([
    '712.82677.38-2',
    '237.95126.95-4',
    '500.12973.80-1',
    '278.90141.14-9',
    '268.27649.96-2',
    '613.01862.91-4',
    '111.11111.11-1',
  ])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test('Parâmetro não informado', () => {
    expect(isPIS('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const pis = fake();
    expect(validate(pis)).toBeTruthy();
    expect(pis).toHaveLength(11);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const pis = fake(true);
    expect(validate(pis)).toBeTruthy();
    expect(pis).toHaveLength(14);

  });

  test.each([
    { value: '7128267738', expected: '0' },
    { value: 2379512695, expected: '5' },
    { value: '5001297380', expected: '3' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.value);
    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');

  });

  test.each([
    { value: '71282677380', expected: '712.82677.38-0' },
    { value: 23795126955, expected: '237.95126.95-5' },
    { value: '50012973803', expected: '500.12973.80-3' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);

    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(14);
  });

  test.each([
    { value: '712.82677.38-0', expected: '71282677380', },
    { value: '237.95126.95-5', expected: '23795126955',  },
    { value: '500.12973.80-3', expected: '50012973803', },
  ])('unmask() - Deve remover a máscara corretamente', (item) => {
    const unmasked = unmask(item.value);

    expect(unmasked).toBe(item.expected);
    expect(unmasked).toHaveLength(11);
  });
});
