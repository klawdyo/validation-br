import ValidationBRError, { InvalidFormatException } from "./_exceptions/ValidationBRError";
import { Random } from "./_helpers/random";
import { Base } from "./base";

export class Email extends Base {
  protected _mask = null;

  constructor(protected _value: string) {
    super(_value);
    this.normalize();

    if (!this.validate()) {
      throw new ValidationBRError('Email inválido');
    }
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this.value;
  }

  protected normalize(): void {
    this._value = this._value.toLocaleLowerCase();
  }

  protected validate(): boolean {
    return /^[0-9a-z._+-]+@[0-9a-z._+-]+(\.[0-9a-z._+-]+)+$/i.test(this._value);
  }

  mask(): string {
    throw new Error("Method not implemented.");
  }

  // 
  // STATIC
  // 

  static fake(): Email {
    const servers = ['gmail.com', 'hotmail.com'];
    return new Email(`${Random.alpha(10)}@${Random.fromArray(servers)}`);
  }

}