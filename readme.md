# pix.js

Biblioteca de geração de códigos pix

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

- [isCPF](#cpf) - Validação do CPF
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

// Devolve o pix copia e cola
isCPF('01234567890')
//-> true
```

## Changelog

- **10/09/2021**:
  - 0.9.0 - Adicionada sanitizeKey() que limpa os caracteres não permitidos de acordo com o tipo da chave
  - 0.8.0 - Adicionada getKeyType() que identifica o tipo da chave pix

## To Do

- Função parse() irá receber o código copia e cola e irá retornar as partes e os seus valores

## Referências

- [Manual do pix do BCB](https://www.bcb.gov.br/content/estabilidadefinanceira/SiteAssets/Manual%20do%20BR%20Code.pdf)
-
