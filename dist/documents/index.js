"use strict";

var isCPF = require('./cpf');

var isCNPJ = require('./cnpj');

var isTitulo = require('./titulo-eleitor');

var isPostalCode = require('./postal-code');

module.exports = {
  isCPF: isCPF,
  isCNPJ: isCNPJ,
  isTitulo: isTitulo,
  isPostalCode: isPostalCode
};
//# sourceMappingURL=index.js.map