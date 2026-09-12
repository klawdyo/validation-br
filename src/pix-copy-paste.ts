import { InvalidChecksumException, InvalidFormatException } from './_exceptions/ValidationBRError';
import { CRC } from './_helpers/crc';
import { Base } from './base';

export class PixCopyPaste extends Base {
  protected _mask = null;

  constructor(protected _value: string) {
    super(_value);
    this.normalize();
    this.validate();
  }

  //
  //
  // static
  //
  //

  //
  //
  // protected
  //
  //

  protected validate(): boolean {
    const crc = new CRC(this._value.substring(0, this._value.length - 4)).calculate();
    if (crc !== this._value.substring(this._value.length - 4)) throw new InvalidChecksumException()

    const parse = PixPart.parse(this._value);
    if (!parse || !Array.isArray(parse)) throw new InvalidFormatException();
    const last = parse[parse.length - 1];
    if (last.code !== '63' || last.size !== 4) throw new InvalidFormatException();

    return true;
  }

  protected normalize(): void {
    this._value = this._value.trim();
  }
}



export class PixPart {
  /**
   * 
   * 
   * 
   */
  static parse(value: string): PartNode[] {
    const parts: PartNode[] = [];

    let rest = value;
    while (rest) {
      const { rest: newRest, ...result } = PixPart.getPart(rest);

      // Entrou em loop infinito
      if (rest === newRest) throw new InvalidFormatException()

      parts.push(result);

      rest = newRest;
    }

    return parts;
  }

  static getPart(part: string): Part {
    if (!part || part.length < 4 || !/^\d{4}/.test(part)) {
      return { part, code: '', size: 0, value: '', rest: part, children: [] };
    }

    const code = part.substring(0, 2);
    const size = +part.substring(2, 4);
    const value = part.substring(4, 4 + size);
    const rest = part.substring(4 + size);

    if (value.length !== size) {
      throw new InvalidFormatException()
    }

    let children: PartNode[] = [];

    const possiblyHasChildren = /^(\d{2})(\d{2})(.*)/.exec(value);

    if (possiblyHasChildren) {
      const hasChildren = possiblyHasChildren && possiblyHasChildren[3].length === +possiblyHasChildren[2];

      if (hasChildren) {
        children = PixPart.parse(value);
      }
    }

    return { code, size, value, rest, children, part };
  }
}

interface PartNode {
  part: string;
  code: string;
  size: number;
  value: string;
  children: PartNode[];
}

interface Part extends PartNode {
  rest: string;
}
