import { validate as cnh } from './cnh';
import { validate as cnpj } from './cnpj';
import { validate as cpf } from './cpf';
import { validate as judicialProcess } from './judicialProcess';
import { validate as nup17 } from './nup17';
import { validate as pisPasep } from './pisPasep';
import { validate as postalCode } from './postalCode';
import { validate as renavam } from './renavam';
import { validate as tituloEleitor } from './tituloEleitor';
import { CarPlate } from './carplate';
import { Phone } from './phone';
import { PixKey } from './pix-key';
import { PixCopyPaste } from './pix-copy-paste';


function validate(fn: Function) {
  try {
    fn()
    return true
  } catch (error) {
    return false
  }
}



export const isCNH = (value: string | number): boolean => cnh(value);
export const isCNPJ = (value: string | number): boolean => cnpj(value);
export const isCPF = (value: string | number): boolean => cpf(value);
export const isJudicialProcess = (value: string): boolean => judicialProcess(value);
export const isPIS = (value: string): boolean => pisPasep(value);
export const isPostalCode = (value: string): boolean => postalCode(value);
export const isRenavam = (value: string): boolean => renavam(value);
export const isTituloEleitor = (value: string | number): boolean => tituloEleitor(value);
export const isNUP17 = (value: string): boolean => nup17(value);


export function isCarPlate(value: string) { return validate(() => new CarPlate(value)) }
export function isPhone(value: string) { return validate(() => new Phone(value)) }
export function isPixKey(value: string) { return validate(() => new PixKey(value)) }
export function isPixCopyPaste(value: string) { return validate(() => new PixCopyPaste(value)) }

// TODO: Remover esse default. Remover os exports acima também
export default {
  isCNH,
  isCNPJ,
  isCPF,
  isJudicialProcess,
  isPIS,
  isPostalCode,
  isRenavam,
  isTituloEleitor,
  isNUP17,
  isCarPlate
}
