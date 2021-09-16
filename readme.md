# validation-br

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ, Título Eleitoral, PIS/PASEP, CNH, e Objetos registrados de rastreamento dos Correios.

## Instalação

```sh
# Usando yarn
yarn add validation-br

## OU
# Usando npm
npm install validation-br

```

## Importação

```js

// Modules
const { isCPF, isCNPJ } = require('validation-br');

// ES6
import { isCPF, isCNPJ } from ('validation-br');


```

## Tabela de Conteúdo

- [isCPF](#isCPF) - Validação do CPF
- [isCNPJ](#isCNPJ) - Validação do CNPJ
- [isTitulo](#isTitulo) - Validação do Título de Eleitor
- [isCNH](#isCNH) - Validação do CNH
- [isPostaCode](#isPostaCode) - Validação de Objetos Registrados dos Correios

### isCPF

Valida um CPF

```js
// Importação
import { isCPF } from ('validation-br');

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

### isCNPJ

Valida um CNPJ

```js
// Importação
import { isCNPJ } from ('validation-br');

// Valida
isCNPJ('73.797.980/0001-79')
//-> true

// Valida
isCNPJ('55.585.709/0001-98')
//-> true

// Valida
isCNPJ('99362238000180')
//-> false
```

### isTitulo

Valida um título eleitoral

```js
// Importação
import { isTitulo } from ('validation-br');

// Valida
isTitulo('743650641660')
//-> true

// Valida
isTitulo('525028881694')
//-> true

// Valida
isTitulo('153016161686')
//-> false
```

### isCNH

Valida o documento da carteira nacional de habilitação

```js
// Importação
import { isCNH } from ('validation-br');

// Valida
isCNH('69044271146')
//-> true

// Valida
isCNH('62472927637')
//-> true

// Valida
isCNH('46190476839')
//-> false
```

### isPostaCode

Valida um código de rastreamento de objetos postais

```js
// Importação
import { isPostalCode } from ('validation-br');

// Valida
isPostalCode('PN718252423BR')
//-> true

// Valida
isPostalCode('RY728187035CN')
//-> true

// Valida
isPostalCode('JT194624698BR')
//-> false
```

## Changelog

- **16/09/2021**:
  - 0.5.0 - Adicionadas as funções isCPF, isCNPJ e isTitulo
  - 0.7.0 - Adicionadas as funções isPostalCode e isCNH

## Referências

- [Cálculo do DV do CPF](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/)
- [Cálculo do DV do CNPJ](http://www.macoratti.net/alg_cnpj.htm)
- [Cálculo do DV do Título Eleitoral](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-titulo-de-eleitor/)
