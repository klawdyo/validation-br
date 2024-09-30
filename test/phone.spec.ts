import { Phone } from '../src/phone';

const cellPhones = ['+5584999580685', '+55 84 9 9958 0685', '+55 (84) 9 9958-0685', '+55 (84) 99958-0685', '84 99958-0685'];
const phones = ['+558433311454', '84 3331-1454', '84 3331 1454', '(84) 3331 1454', '84-3331-1454'];

describe('Phone', () => {
  describe('constructor', () => {
    test.each(cellPhones)('Celular %s deve estar definido', (value) => {
      const obj = new Phone(value);
      expect(obj.value).toBe('+5584999580685');
      expect(obj.ddi).toBe('+55');
      expect(obj.ddd).toBe('84');
      expect(obj.phone).toBe('999580685');
      expect(obj.isMobile).toBeTruthy();
    });

    test.each(phones)('Telefone fixo %s deve estar definido', (value) => {
      const obj = new Phone(value);
      expect(obj.value).toBe('+558433311454');
      expect(obj.ddi).toBe('+55');
      expect(obj.ddd).toBe('84');
      expect(obj.phone).toBe('33311454');
      expect(obj.isMobile).toBeFalsy;
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('Cria um fake', () => {
      const fake = Phone.fake();
      expect(fake).toBeDefined();
    });

    test.each([...Array(5)])('Cria um fake com DDD 11', () => {
      const fake = Phone.fake({ ddd: '11' });
      expect(fake).toBeDefined();
      expect(fake.ddd).toBe('11');
    });

    test.each([...Array(5)])('Cria um fake com isMobile=true', () => {
      const fake = Phone.fake({ isMobile: true });
      expect(fake).toBeDefined();
      expect(fake.isMobile).toBeTruthy()
      expect(fake.phone.length).toBe(9)
    });

    test.each([...Array(5)])('Cria um fake com isLandline=true', () => {
      const fake = Phone.fake({ isLandline: true });      
      expect(fake).toBeDefined();
      expect(fake.isMobile).toBeFalsy()
      expect(fake.phone.length).toBe(8)
    });
  });

  describe('mask', () => {
    test.each(cellPhones)('Máscara de celular sem país', (input) => {
      const phone = new Phone(input);
      expect(phone.mask({ withCountry: false })).toBe('84 999580685');
    });

    test.each(cellPhones)('Máscara de celular com país', (input) => {
      const phone = new Phone(input);
      expect(phone.mask({ withCountry: true })).toBe('+55 84 999580685');
    });

    test.each(phones)('Máscara de telefone fixo sem país', (input) => {
      const phone = new Phone(input);
      expect(phone.mask({ withCountry: false })).toBe('84 33311454');
    });

    test.each(phones)('Máscara de telefone fixo com país', (input) => {
      const phone = new Phone(input);
      expect(phone.mask({ withCountry: true })).toBe('+55 84 33311454');
    });
  });
});
