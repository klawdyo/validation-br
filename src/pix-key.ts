import { InvalidFormatException } from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';
import { CNPJ } from './cnpj';
import { CPF } from './cpf';
import { Email } from './email';
import { isCNPJ, isCPF, isEmail, isPhone, isUUID } from './main';
import { Phone } from './phone';
import { UUID } from './uuid';

export enum PixKeys {
  email = 'email',
  cpf = 'cpf',
  cnpj = 'cnpj',
  evp = 'evp',
  phone = 'phone',
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

  /**
   * Gera uma chave fake 
   */
  static fake(options: PixKeyOptions = {}): PixKey {
    if (!options.type) {
      options.type = Random.fromArray([
        PixKeys.cnpj, PixKeys.cpf, PixKeys.email, PixKeys.evp, PixKeys.phone,
      ])
    }

    if (options?.type == PixKeys.cnpj) return new PixKey(CNPJ.fake().toString());
    if (options?.type == PixKeys.cpf) return new PixKey(CPF.fake().toString());
    if (options?.type == PixKeys.phone) return new PixKey(Phone.fake().toString());
    if (options?.type == PixKeys.email) return new PixKey(Email.fake().toString());
    return new PixKey(UUID.fake().toString());
  }

  //
  //
  // PROTECTED
  //
  //

  protected validate(): boolean {
    return [
      { type: PixKeys.cpf, fn: isCPF },
      { type: PixKeys.cnpj, fn: isCNPJ },
      { type: PixKeys.evp, fn: isUUID },
      { type: PixKeys.email, fn: isEmail },
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

}

export interface PixKeyOptions {
  type?: PixKeys;
}