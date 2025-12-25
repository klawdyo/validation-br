import isCPF, { dv, fake, mask, validate, validateOrFail, normalize } from '../src/cpf';
import * as _cpf from '../src/cpf';

describe('CPF', () => {
  test.each([
    // masked
    '133.782.710-00',
    '400.448.260-79',
    // integer
    8796742020, // começa com zero
    74172316085,
    // string
    '15886489070',
    '90889477086',
  ])('isCPF() - Números válidos', (item) => {

    expect(isCPF(item)).toBeTruthy();
    expect(_cpf.validate(item)).toBeTruthy();

  });

  test.each([
    // masked
    '133.782.710-00',
    '400.448.260-79',
    // integer
    8796742020, // começa com zero
    74172316085,
    // string
    '15886489070',
    '90889477086',
  ])('validate() - Números válidos', (item) => {
    expect(validate(item)).toBeTruthy();
  });

  test.each([
    '287.967.420-20',
    '333.782.710-00',
    '200.448.260-79',
    '24172316085',
    '25886489070',
    '20889477086',
    '11111111111',
  ])('validate() - Números inválidos', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test.each([
    '287.967.420-20',
    '333.782.710-00',
    '200.448.260-79',
    '24172316085',
    '25886489070',
    '20889477086',
    '11111111111',
  ])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test.each([
    '24172316085000000',
    '25886489070999999',
    '20889477086888888',
    '11111111111777777',
  ])('validate() - Números válidos com caracteres adicionais', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test('Parâmetro não informado', () => {
    expect(isCPF('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const cpf = fake();
    expect(validate(cpf)).toBeTruthy();
    expect(cpf).toHaveLength(11);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const cpf = fake(true);
    expect(validate(cpf)).toBeTruthy();
    expect(cpf).toHaveLength(14);
  });

  test.each([
    { num: '741723160', expected: '85' },
    { num: 158864890, expected: '70' },
    { num: '908894770', expected: '86' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.num);
    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { num: '74172316085', expected: '741.723.160-85' },
    { num: 15886489070, expected: '158.864.890-70' },
    { num: '90889477086', expected: '908.894.770-86' },
    { num: 889477086, expected: '008.894.770-86' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.num);
    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(14);
  });

  test.each([
    { value: '741.723.160-85', expected: '74172316085' },
    { value: '158.864.890-70', expected: '15886489070' },
    { value: '908.894.770-86', expected: '90889477086' },
    { value: '008.894.770-86', expected: '00889477086' },
    { value: '74172316085', expected: '74172316085' },
    { value: '15886489070', expected: '15886489070' },
    { value: '90889477086', expected: '90889477086' },
    { value: '889477086', expected: '00889477086' },
  ])('normalize() - Testando se remove a máscara corretamente', (item) => {
    const masked = normalize(item.value);

    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(11);
  });
});
