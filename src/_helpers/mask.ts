import { applyMask } from "../utils";

export class Mask {
  constructor(private _value: string) { }

  apply(mask: string): string {
    return applyMask(this._value, mask)
  }
}