import  { InvalidFormatException } from './_exceptions/ValidationBRError';
import { Base } from './base';
import { isCNPJ, isCPF, isPhone } from './main';

export enum PixKeys {
  email,
  cpf,
  cnpj,
  evp,
  phone,
}

/**
 *
 * Valida se é uma chave pix
 *
 */
export class PixKey extends Base {
  protected _mask = null;
  private _type?: PixKeys;

  constructor(protected _value: string) {
    super(_value);
    this.normalize();

    if (!this.validate()) {
      throw new InvalidFormatException();
    }
  }

  get type() {
    return this._type;
  }

  //
  //
  // STATIC
  //
  //

  static fake() {}

  //
  //
  // PROTECTED
  //
  //

  protected validate(): boolean {
    return [
      { type: PixKeys.cpf, fn: isCPF },
      { type: PixKeys.cnpj, fn: isCNPJ },
      { type: PixKeys.evp, fn: this.isUUID },
      { type: PixKeys.email, fn: this.isEmail },
      { type: PixKeys.phone, fn: isPhone },
    ].some(({ type, fn }) => {
      if (fn(this._value)) {
        this._type = type;
        return true;
      }

      return false;
    });
  }

  protected normalize() {
    this._value = this._value.trim().toLocaleLowerCase();
  }

  //
  //
  // PRIVATE
  //
  //

  private isUUID(value: string) {
    return /^[0-9a-z]{8}-[0-9a-z]{4}-4[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{12}$/i.test(value);
  }

  private isEmail(value: string) {
    return /^[0-9a-z._+-]+@[0-9a-z._+-]+(\.[0-9a-z._+-]+)+$/i.test(value);
  }
}
