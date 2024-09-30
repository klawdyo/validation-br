import ValidationBRError from './_exceptions/ValidationBRError';
import { CRC } from './_helpers/crc';
import { Base } from './base';

export class PixCopyPaste extends Base {
  protected _mask = null;

  constructor(protected _value: string) {
    super(_value);

    this.normalize(_value);

    if (!this.validate()) {
      throw ValidationBRError.INVALID_FORMAT
    }
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
    if (crc !== this._value.substring(this._value.length - 4)) throw ValidationBRError.INVALID_DV

    const parse = PixCopyPaste.parse(this._value);
    if (!parse || !Array.isArray(parse)) throw ValidationBRError.INVALID_FORMAT;
    if (parse.at(-1)!.code !== '63' || parse.at(-1)!.size !== 4) throw ValidationBRError.INVALID_FORMAT;

    return true;
  }

  protected normalize(value: string): void {
    this._value = value.trim();
  }

  //
  //
  // private
  //
  //

  /**
   *
   * Faz o parse
   *
   */
  static parse(value: string) {
    return parse(value);
  }
}
function parse(value: string): Part[] {
  const parts: any[] = [];
  
  let rest = value;
  while (rest) {
    const { rest: newRest, ...result } = getPart(rest);
    
    // Entrou em loop infinito
    if(rest === newRest) throw ValidationBRError.INVALID_FORMAT
    
    parts.push(result);
    
    rest = newRest;
  }

  return parts;
}

function getPart(part: string): Part {
  if (!part || part.length < 4 || !/^\d{4}/.test(part)) {
    return { part, code: '', size: 0, value: '', rest: part, children: [] };
  }

  const code = part.substring(0, 2);
  const size = +part.substring(2, 4);
  const value = part.substring(4, 4 + size);
  const rest = part.substring(4 + size);

  if (value.length !== size) {
    throw ValidationBRError.INVALID_FORMAT
  }

  let children: Part[] = [];

  const possiblyHasChildren = /^(\d{2})(\d{2})(.*)/.exec(value);
  
  if (possiblyHasChildren) {
    const hasChildren = possiblyHasChildren && possiblyHasChildren[3].length === +possiblyHasChildren[2];

    if (hasChildren) {
      children = parse(value);
    }
  }

  return { code, size, value, rest, children, part };
}

interface Part {
  part: string;
  code: string;
  size: number;
  value: string;
  rest: string;
  children: Part[];
}
