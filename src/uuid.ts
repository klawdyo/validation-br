import ValidationBRError, { InvalidFormatException } from "./_exceptions/ValidationBRError";
import { Random } from "./_helpers/random";
import { Base } from "./base";

export class UUID extends Base {
  protected _mask = '00000000-0000-0000-0000-000000000000';

  constructor(protected _value: string) {
    super(_value);

    if (!this.validate()) {
      throw new ValidationBRError('UUID inválido');
    }

    this.normalize();

  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this.value;
  }

  protected normalize(): void {
    this._value = this._value.replace(/[^0-9a-z]+/i, '').toLocaleLowerCase();
  }

  protected validate(): boolean {
    return /^[0-9a-z]{8}-?[0-9a-z]{4}-?4[0-9a-z]{3}-?[0-9a-z]{4}-?[0-9a-z]{12}$/i.test(this._value);

  }

  // 
  // STATIC
  // 

  static fake(): UUID {
    return new UUID(`${Random.number(8, true)}-${Random.number(4, true)}-4${Random.number(3, true)}-${Random.number(4, true)}-${Random.number(12, true)}`);
  }

}
