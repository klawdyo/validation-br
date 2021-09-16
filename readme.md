# Brazilidation

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ, Título Eleitoral, PIS/PASEP, CNH, Inscrições Estaduais, Placas de veículos, CEPs e objetos registrados dos correios.

## Instalação

```sh
# Usando yarn
yarn add brazilidation

## OU
# Usando npm
npm install brazilidation

```

## Importação

```js

// Modules
const { isCPF, isCNPJ } = require('brazilidation');

// ES6
import { isCPF, isCNPJ } from ('brazilidation');


```

## Métodos

- [isCPF](#CPF) - Validação do CPF
- [isCNPJ](#cnpj) - Validação do CNPJ
- [isTitulo](#titulo) - Validação do Título de Eleitor
- [isCNH](#cnpj) - Validação do CNH
- [isPIS](#cnpj) - Validação do PIS
- [isRegisteredObject](#cnpj) - Validação de Objetos Registrados dos Correios

### CPF

Descrição

```js
// Importação
import { isCPF } from ('brazilidation');

// Valida
isCPF('01234567890')
//-> true

// Valida
isCPF('012.345.678-90')
//-> true

// Valida
isCPF('01234567891')
//-> false
```

## Changelog

- **16/09/2021**:
  - 0.5.0 - Adicionadas as funções isCPF, isCNPJ e isTitulo

## Referências

- [Cálculo do DV do CPF](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/)
- [Cálculo do DV do CNPJ](http://www.macoratti.net/alg_cnpj.htm)
- [Cálculo do DV do Título Eleitoral](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-titulo-de-eleitor/)
