# validation-br

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ, Título Eleitoral, PIS/PASEP, CNH, e Objetos registrados de rastreamento dos Correios.

![JS](https://img.shields.io/badge/Language-JS-yellow)
![npm version](https://badge.fury.io/js/validation-br.svg)
![issues](https://img.shields.io/github/issues/klawdyo/validation-br)
![forks](https://img.shields.io/github/forks/klawdyo/validation-br)
![license](https://img.shields.io/github/license/klawdyo/validation-br)
![tweet](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2Fklawdyo%2Fvalidation-br)

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
- [isPostalCode](#isPostalCode) - Validação de Objetos Registrados dos Correios
- [isPIS](#isPIS) - Validação de PIS, PASEP, NIS e NIT

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
isCNPJ('55585709000198')
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

Valida o documento da carteira nacional de habilitação.

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

### isPostalCode

Valida um código de rastreamento de objetos postais no formato XX000000000YY, onde:

- XX: O código do objeto postal com 2 dígitos;
- 000000000: Número sequencial do objeto com 9 dígitos;
- YY: País de origem do objeto com 2 dígitos.

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

### isPIS

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação
import { isPIS } from ('validation-br');

// Valida
isPIS('71282677380')
//-> true

// Valida
isPIS('237.95126.95-5')
//-> true

// Valida
isPIS('500.12973.80-1')
//-> false
```

## Tests
![image](https://user-images.githubusercontent.com/100168/133695302-17744b22-2bf0-41e8-8907-58ea4770be3c.png)



## Changelog

- **16/09/2021**:
  - 0.5.0 - Adicionadas as funções isCPF, isCNPJ e isTitulo
  - 0.7.0 - Adicionadas as funções isPostalCode e isCNH
  - 0.8.0 - Adicionada a função isPIS

## Referências

- [Cálculo do DV do CPF](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/)
- [Cálculo do DV do CNPJ](http://www.macoratti.net/alg_cnpj.htm)
- [Cálculo do DV do Título Eleitoral](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-titulo-de-eleitor/)
- [Cálculo do PIS](http://www.macoratti.net/alg_pis.htm)
- [Diferença entre PIS, PASEP, NIS e NIT](https://www.jornalcontabil.com.br/entenda-de-uma-vez-a-diferenca-entre-pis-pasep-nit-e-nis/#:~:text=NIS%20%E2%80%93%20N%C3%BAmero%20de%20Identifica%C3%A7%C3%A3o%20Social,do%20Patrim%C3%B4nio%20do%20Servidor%20P%C3%BAblico)
