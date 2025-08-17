import { Email } from "../src/email";

describe('Email', () => {
  describe('constructor', () => {
    test('Deve definir um email', () => {
      const email = new Email('klawdyo@gmail.com');
      expect(email).toBeDefined()
    });
  });

  describe('fake', () => {
    test('Deve definir um email fake', () => {
      const email = Email.fake();
      
      expect(new Email(email.toString())).toBeDefined()
      expect(new Email(email.value)).toBeDefined()
    });
  });
});