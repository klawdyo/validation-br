import { checkRepeatedSequence } from "../src/utils";

test.each([
  '11111111',
  '1111',
])('testa se %s tem todos os valores iguais', (value) => {
  expect(checkRepeatedSequence(value)).toBeTruthy();
});

test.each([
  '12345678',
  '11111112',
  '1234',
  '2111',
])('testa se %s não tem todos os valores iguais', (value) => {
  expect(checkRepeatedSequence(value)).toBeFalsy();
});