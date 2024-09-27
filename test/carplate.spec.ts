import { CarPlate } from '../src/carplate'
import { isCarPlate } from '../src/main';

describe('CarPlate', () => {
  describe('construtor', () => {

    test.each([
      'AAA0000',
      'AAA-0000',
      'AAA0F00',
      'AAA-0F00',
      'AbA0F00',
      'abc-0h00',
      'abc-0h00 ',
    ])('A placa %s deve ser válida', (input) => {
      expect(new CarPlate(input)).toBeDefined()
    });

    test.each([
      'A2A0000',
      'AAA-00A0',
      'AAA0F0',
      'AAA0F077',
      'AAA0F-077',
      '',
      null,
      undefined,
    ])('A placa %s deve lançar erro', (input) => {
      expect(() => new CarPlate(input as any)).toThrow()
    })
  })

  describe('isCarPlate', () => {

    test.each([
      'AAA0000',
      'AAA-0000',
      'AAA0F00',
      'AAA-0F00',
      'AbA0F00',
      'abc-0h00',
    ])('A placa %s deve ser válida', (clarPlate) => {
      expect(isCarPlate(clarPlate)).toBeTruthy()
    });

    test.each([
      'A2A0000',
      'AAA-00A0',
      'AAA0F0',
      'AAA0F077',
      '',
      null,
      undefined,
    ])('A placa %s não deve ser válida', (clarPlate) => {
      expect(isCarPlate(clarPlate as any)).toBeFalsy()
    })
  })

  // describe('validate', () => {

  //   test.each([
  //     'AAA0000',
  //     'AAA-0000',
  //     'AAA0F00',
  //     'AAA-0F00',
  //     'AbA0F00',
  //     'abc-0h00',
  //   ])('A placa %s deve ser válida', (clarPlate) => {
  //     expect(validate(clarPlate)).toBeTruthy()
  //   });

  //   test.each([
  //     'A2A0000',
  //     'AAA-00A0',
  //     'AAA0F0',
  //     'AAA0F077',
  //     '',
  //     null,
  //     undefined,
  //   ])('A placa %s não deve ser válida', (clarPlate) => {
  //     // @ts-ignore
  //     expect(validate(clarPlate)).toBeFalsy()
  //   })
  // })


  // describe('validateOrFail', () => {

  //   test.each([
  //     'AAA0000',
  //     'AAA-0000',
  //     'AAA0F00',
  //     'AAA-0F00',
  //     'AbA0F00',
  //     'abc-0h00',
  //   ])('A placa %s deve ser válida', (clarPlate) => {
  //     expect(validateOrFail(clarPlate)).toBeTruthy()
  //   });

  //   test.each([
  //     'A2A0000',
  //     'AAA-00A0',
  //     'AAA0F0',
  //     'AAA0F077',
  //     '',
  //     null,
  //     undefined,
  //   ])('A placa %s não deve ser válida', (clarPlate) => {
  //     // @ts-ignore
  //     expect(()=>validateOrFail(clarPlate)).toThrow()
  //   })
  // })


  // describe('DV', () => {

  //   test('Car plate não tem DV', () => {
  //     expect(dv('AAA0000')).toBeNull()
  //     expect(checksum('AAA0000')).toBeNull()
  //   })
  // })

  // describe('fake', () => {

  //   test('Gera fakes sem mascara', () => {
  //     for (let i = 0; i <= 20; i++) {
  //       const carPlate = fake()


  //       expect(validate(carPlate)).toBeTruthy()
  //       expect(carPlate.length).toBe(7)
  //     }
  //   })

  //   test('Gera fakes com mascara', () => {
  //     for (let i = 0; i <= 20; i++) {
  //       const carPlate = fake(true)
  //       expect(validate(carPlate)).toBeTruthy()
  //       expect(carPlate.length).toBe(8)
  //     }
  //   })
  // })

  // describe('mask', () => {

  //   test.each([
  //     'AAA0000',
  //     'AAA0900',
  //     'AAA0F00',
  //     'AGA0F00',
  //     'aba0F00',
  //     'abc0h00',
  //   ])('A placa %s deve ser válida', (clarPlate) => {
  //     const masked = mask(clarPlate)
  //     expect(masked).toBeDefined()
  //     expect(masked).toBe(masked.toLocaleUpperCase())
  //     expect(masked.length).toBe(8)
  //     expect(masked).toMatch(/^[A-Z]{3}-[0-9][A-Z0-9][0-9]{2}$/)
  //   })
  // })
})