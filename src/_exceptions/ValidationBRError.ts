export default class ValidationBRError extends Error {
  static INVALID_DV = new ValidationBRError('Dígito verificador inválido')
  static INVALID_FORMAT = new ValidationBRError('Formato inválido')
  static EMPTY_VALUE = new ValidationBRError('Valor não preenchido')
  static MAX_LEN_EXCEDEED = new ValidationBRError('Número de caracteres excedido')
  static REPEATED_SEQUENCE = new ValidationBRError('Sequência de números repetidos não permitida')
}
