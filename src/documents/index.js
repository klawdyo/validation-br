const isCNH = require('./cnh').validate;
const isCNPJ = require('./cnpj').validate;
const isCPF = require('./cpf').validate;
const isJudicialProcess = require('./judicial-process').validate;
const isPIS = require('./pis-pasep').validate;
const isPostalCode = require('./postal-code').validate;
const isRenavam = require('./renavam').validate;
const isTitulo = require('./titulo-eleitor');

module.exports = {
  isCNH,
  isCNPJ,
  isCPF,
  isJudicialProcess,
  isPIS,
  isPostalCode,
  isRenavam,
  isTitulo,
};
