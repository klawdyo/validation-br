const isCPF = require('./cpf');
const isCNPJ = require('./cnpj');
const isTitulo = require('./titulo-eleitor');
const isPostalCode = require('./postal-code');
const isCNH = require('./cnh');
const isPIS = require('./pis-pasep');
const renavam = require('./renavam').validate;
const judicialProcess = require('./judicial-process').validate;

module.exports = {
  isCPF,
  isCNPJ,
  isTitulo,
  isPostalCode,
  isCNH,
  isPIS,
  isRenavam: renavam,
  isJudicialProcess: judicialProcess,
};
