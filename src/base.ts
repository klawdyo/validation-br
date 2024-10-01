import { Mask } from './_helpers/mask';

export abstract class Base {
  /**
   * Estilo da máscara no formato: 000.000.000-00
   *
   */
  protected abstract _mask: string | null;

  constructor(protected _value: string, fakeFn?: Function) {}

  get value() {
    return this._value;
  }

  toString() {
    return this.value;
  }

  //
  //
  //
  //
  //

  /**
   * Deve remover apenas pontos e traços.
   */
  protected abstract normalize(value: string): void;

  /**
   * Deve aplicar as regras de validação do dígito verificador do documento
   */
  protected abstract validate(value: string): boolean;

  //
  //
  //
  //
  //

  /**
   * Deve devolver o número com a máscara
   */
  mask(): string {
    if (!this._mask) return this._value;
    return new Mask(this._value).apply(this._mask);
  }

  //
  //
  // STATIC
  //
  //

  /**
   * Deve calcular o dígito verificador do número passado sem o dígito
   */
  static checksum(value: string): string | null {
    throw new Error('Should implement on child');
  }

  /**
   * Deve gerar um número fake no padrão
   */
  static fake(options?: any): any {
    throw new Error('Should implement on child');
    // Base.fakeFn(options)
  }
}
