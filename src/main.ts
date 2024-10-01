import { CNH, } from './cnh';
import { CNPJ } from './cnpj';
import { CPF, } from './cpf';
import { NUP17 } from './nup17';
import { PIS } from './pis-pasep';
import { validate as renavam } from './renavam';
import { validate as tituloEleitor } from './tituloEleitor';
import { CarPlate } from './carplate';
import { Phone } from './phone';
import { PixKey } from './pix-key';
import { PixCopyPaste } from './pix-copy-paste';
import { JudicialProcess } from './judicial-process';
import { PostalTrackCode } from './postal-track-code';
import { TituloEleitor } from './tituloEleitor';


function validate(fn: Function) {
  try {
    fn()
    return true
  } catch (error) {
    return false
  }
}

export const isRenavam = (value: string): boolean => renavam(value);
export const isTituloEleitor = (value: string | number): boolean => tituloEleitor(value);


export function isCNH(value: string) { return validate(() => new CNH(value)) }
export function isCNPJ(value: string) { return validate(() => new CNPJ(value)) }
export function isCPF(value: string) { return validate(() => new CPF(value)) }
export function isCarPlate(value: string) { return validate(() => new CarPlate(value)) }
export function isJudicialProcess(value: string) { return validate(() => new JudicialProcess(value)) }
export function isNUP17(value: string) { return validate(() => new NUP17(value)) }
export function isPhone(value: string) { return validate(() => new Phone(value)) }
export function isPIS(value: string) { return validate(() => new PIS(value)) }
export function isPixKey(value: string) { return validate(() => new PixKey(value)) }
export function isPixCopyPaste(value: string) { return validate(() => new PixCopyPaste(value)) }
export function isPostalTrackCode(value: string) { return validate(() => new PostalTrackCode(value)) }
export function isTituloEleitor(value: string) { return validate(() => new TituloEleitor(value)) }

