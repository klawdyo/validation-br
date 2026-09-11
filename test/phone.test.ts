import isPhone, { fake, normalize, mask, validate, validateOrFail } from '../src/phone';
import * as _phone from '../src/phone';

describe('Phone', () => {
  test.each([
    '11987654321',
    '21987654321',
    '85987654321',
    '1133334444',
    '1140028922',
    '987654321',
    '33334444',
    '(11) 9 8765-4321',
  ])('isPhone() - Números válidos', (item) => {

    expect(isPhone(item)).toBeTruthy();
    expect(_phone.validate(item)).toBeTruthy();

  });

  test.each([
    '11987654321',
    '1133334444',
    '987654321',
    '33334444',
  ])('validate() - Números válidos', (item) => {

    expect(validate(item)).toBeTruthy();

  });

  test.each([
    '11111111111',
    '01187654321',
    '1101234567',
    '11887654321',
    '1234567',
    '119876543210',
  ])('validate() - Números inválidos', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test.each([
    '11111111111',
    '01187654321',
    '1101234567',
    '11887654321',
    '1234567',
    '119876543210',
  ])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test('Parâmetro não informado', () => {
    expect(isPhone('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes corretamente', () => {
    const phone = fake();

    expect(validate(phone)).toBeTruthy();
    expect(phone).toHaveLength(11);
  });

  test.each([...Array(5)])('fake(true) - Gera fakes com máscara corretamente', () => {
    const phone = fake(true);

    expect(validate(phone)).toBeTruthy();
    expect(phone).toHaveLength(16);
  });

  test.each([
    { value: '(11) 9 8765-4321', expected: '11987654321' },
    { value: '(11) 3333-4444', expected: '1133334444' },
    { value: '9 8765-4321', expected: '987654321' },
  ])('normalize() - Deve retirar a máscara corretamente', (item) => {
    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
  });

  test.each([
    { value: '11987654321', expected: '(11) 9 8765-4321' },
    { value: '1133334444', expected: '(11) 3333-4444' },
    { value: '987654321', expected: '9 8765-4321' },
    { value: '33334444', expected: '3333-4444' },
  ])('mask() - Deve aplicar a máscara corretamente', (item) => {
    const masked = mask(item.value);

    expect(masked).toBe(item.expected);
  });

  test('mask() - Mantém o valor quando não há máscara para o tamanho', () => {
    expect(mask('123')).toBe('123');
  });
});
