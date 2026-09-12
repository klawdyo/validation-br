import { CNH, } from './cnh';
import { CNPJ } from './cnpj';
import { CPF, } from './cpf';
import { NUP17 } from './nup17';
import { PIS } from './pis-pasep';
import { Renavam } from './renavam';
import { CarPlate } from './carplate';
import { Phone } from './phone';
import { PixKey } from './pix-key';
import { PixCopyPaste } from './pix-copy-paste';
import { JudicialProcess } from './judicial-process';
import { PostalTrackCode } from './postal-track-code';
import { TituloEleitor } from './tituloEleitor';
import { UUID } from './uuid';
import { Email } from './email';
import { Boleto } from './boleto';
import { CAEPF } from './caepf';
import { CEP } from './cep';
import { Certidao } from './certidao';
import { CBISinter } from './cbi_sinter';
import { UF } from './uf';


function validate(fn: () => void) {
  try {
    fn()
    return true
  } catch {
    return false
  }
}

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
export function isRenavam(value: string) { return validate(() => new Renavam(value)) }
export function isTituloEleitor(value: string) { return validate(() => new TituloEleitor(value)) }
export function isEmail(value: string) { return validate(() => new Email(value)) }
export function isUUID(value: string) { return validate(() => new UUID(value)) }
export function isBoleto(value: string) { return validate(() => new Boleto(value)) }
export function isCAEPF(value: string) { return validate(() => new CAEPF(value)) }
export function isCEP(value: string) { return validate(() => new CEP(value)) }
export function isCertidao(value: string) { return validate(() => new Certidao(value)) }
export function isCBISinter(value: string) { return validate(() => new CBISinter(value)) }
export function isUF(value: string) { return validate(() => new UF(value)) }

