export default class ValidationBRError extends Error {
  constructor(message: string){
    super(message)
  }
}

export class InvalidChecksumException extends ValidationBRError {
  constructor(){
    super('Dígito verificador inválido');
  }
}

export class InvalidFormatException extends ValidationBRError {
  constructor(){
    super('Formato inválido');
  }
}

export class EmptyValueException extends ValidationBRError {
  constructor(){
    super('Valor não preenchido');
  }
}

export class TooLongException extends ValidationBRError {
  constructor(){
    super('Número de caracteres excedido');
  }
}

export class TooShortException extends ValidationBRError {
  constructor(){
    super('Número de caracteres muito curto');
  }
}

export class RepeatedSequenceException extends ValidationBRError {
  constructor(){
    super('Sequência de números repetidos não permitida');
  }
}

export class NoChecksumException extends ValidationBRError {
  constructor(){
    super('Este objeto não possui dígito verificador');
  }
}
