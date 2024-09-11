import { Phone, fake, checksum, mask, validate, validateOrFail } from "../src/phone";

describe('Phone', () => {


  describe('validate', () => {

    test.each([
      '+5584998765432',
      '+55 84 9 9876 5432',
      '+55 (84) 9 9876-5432',
      '+55 (84) 99876-5432',
      '84 99876-5432',
    ])('valida celular %s', (value) => {
      const obj = new Phone(value)
      const phone = obj.validate()
      expect(phone).toBeTruthy()
    });

    test.each([
      '+558433311454',
      '84 3331-1454',
      '84 3331 1454',
      '(84) 3331 1454',
      '(84)3331 1454',
      '(84)33311454',
      '84-3331-1454',
      '84-4004-4105',
      '(84) 4005 2856',
    ])('valida telefone fixo %s', (value) => {
      const obj = new Phone(value)
      const phone = obj.validate()
      expect(phone).toBeTruthy()
    });

    test.each([
      '+5584333311454',
      '84 3331-  1454',
      '3331 1454',
      'AA 3331 1454',
      '849999999999',
      '123',
      '',
      null,
      undefined,
    ])('não valida telefone %s', (value) => {
      // @ts-ignore
      expect(() => new Phone(value)).toThrow()
    });

    test('validate()', () => {
      expect(validate('84999583214')).toBeTruthy()
      expect(validate('84 999 5814')).toBeFalsy()
    });

    test('validateOrFail()', () => {
      expect(validateOrFail('84999583214')).toBeTruthy()
      expect(() => validateOrFail('84 999 5814')).toThrow()
    });
  })

  describe('checksum', () => {
    test('Phone não tem dígito verificador', () => {
      const phone = new Phone('8498765432');
      expect(phone.checksum()).toBeNull();
    })

    test('Phone não tem dígito verificador', () => {
      const phone = checksum('8498765432');
      expect(phone).toBeNull();
    })
  })

  describe('normalize', () => {

    test.each([
      '+5584999580685',
      '+55 84 9 9958 0685',
      '+55 (84) 9 9958-0685',
      '+55 (84) 99958-0685',
      '84 99958-0685',
    ])('testa normalização de celular %s', (value) => {
      const obj = new Phone(value)
      const phone = obj.normalize()
    });

    test.each([
      '+558433311454',
      '84 3331-1454',
      '84 3331 1454',
      '(84) 3331 1454',
      '84-3331-1454',
    ])('testa normalização de telefone fixo %s', (value) => {
      const obj = new Phone(value)
      const phone = obj.normalize()
    });



  })

  describe('fake', () => {
    test.each([...Array(5)].map(() => Phone.fake()))('Testa um fake %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => Phone.fake({ withMask: true })))('Testa um fake com máscara %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => Phone.fake({ withCountry: true })))('Testa um fake com código do país %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => Phone.fake({ withCountry: true, withMask: true })))('Testa um fake com máscara e código do país %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => Phone.fake({ ddd: '84' })))('Testa um fake com ddd definido %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })
    
    test.each([...Array(5)].map(() => fake({ ddd: '84' })))('Testa um fake com ddd definido %s', (value) => {
      expect(validate(value)).toBeTruthy()
    })

    test.each([...Array(5)])('Testa um fake com ddd que não existe %s', (value) => {
      expect(() => Phone.fake({ ddd: '01' })).toThrow()
      expect(() => fake({ ddd: '01' })).toThrow()
    })

    test.each([...Array(5)].map(() => Phone.fake({ isMobile: true })))('Testa um fake mobile %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => Phone.fake({ isLandline: true })))('Testa um fake fixo %s', (value) => {
      const phone = new Phone(value)
      expect(phone.validate()).toBeTruthy()
    })

    test.each([...Array(5)].map(() => fake({ isLandline: true })))('Testa um fake fixo %s usando o método externo', (value) => {
      expect(validate(value)).toBeTruthy()
    })
  })

  describe('mask', () => {
    test('Máscara', () => {
      const phone = new Phone('8498765432');
      expect(phone.mask()).toBe('84 98765432');
    })

    test('Máscara com país', () => {
      const phone = new Phone('8498765432');
      expect(phone.mask({ withCountry: true })).toBe('+55 84 98765432');
    })

    test('Máscara com método individual', () => {
      const phone = checksum('8498765432');
      expect(mask('8498765432')).toBe('84 98765432');
    })

    test('Máscara com método individual com país', () => {
      const phone = checksum('8498765432');
      expect(mask('8498765432', { withCountry: true })).toBe('+55 84 98765432');
    })
  })
})