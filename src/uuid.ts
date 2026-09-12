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

  protected normalize(): void {
    this._value = this._value.replace(/[^0-9a-z]+/gi, '').toLocaleLowerCase();
  }

  protected validate(): boolean {
    // O quarto grupo (variante, RFC 4122) deve iniciar com 8, 9, a ou b.
    // Os demais caracteres devem ser hexadecimais (0-9, a-f).
    return /^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i.test(this._value);

  }

  //
  // STATIC
  //

  static fake(): UUID {
    const variant = Random.fromArray(['8', '9', 'a', 'b']);
    return new UUID(`${Random.number(8, true)}-${Random.number(4, true)}-4${Random.number(3, true)}-${variant}${Random.alpha(3, false, true)}-${Random.number(12, true)}`);
  }

}
