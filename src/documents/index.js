const isCPF = require('./cpf');
const isCNPJ = require('./cnpj');
const isTitulo = require('./titulo-eleitor');
const isPostalCode = require('./postal-code');

module.exports = {
  isCPF,
  isCNPJ,
  isTitulo,
  isPostalCode,
};
