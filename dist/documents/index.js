"use strict";

var isCPF = require('./cpf');

var isCNPJ = require('./cnpj');

var isTitulo = require('./titulo-eleitor');

var isPostalCode = require('./postal-code');

var isCNH = require('./cnh');

module.exports = {
  isCPF: isCPF,
  isCNPJ: isCNPJ,
  isTitulo: isTitulo,
  isPostalCode: isPostalCode,
  isCNH: isCNH
};
//# sourceMappingURL=index.js.map