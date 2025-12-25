# validation-br

> **A primeira biblioteca a inserir o suporte ao CNPJ alfanumérico**

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ (numérico e **alfanumérico**), Título Eleitoral, PIS/PASEP, CNH. 

`Validation-BR` também valida numerações de outros tipos de registros como RENAVAM, Processos Judiciais, Número de Protocolo do Governo Federal e Objetos registrados de Rastreamento dos Correios, além de permitir a criação de números fake para facilitar o desenvolvimento e testes, aplicar máscaras e calcular somente os dígitos verificadores.

# Instalação

```sh
# Usando yarn
yarn add validation-br

# Usando npm
npm install validation-br

```

# Importação

## Importação direta

```js
// Modules
const { isCPF, isCNPJ } = require('validation-br');

// ES6 - Importação a partir do objeto principal
import { isCPF, isCNPJ } from 'validation-br';
```

## Importação de submódulos

Importando os submódulos, é possível criar máscaras, números fake para testes de desenvolvimento e calcular dígitos verificadores.

> As funções dos exemplos abaixo se aplicam a todos os tipos de documentos.

```js
// Importação direta
import { isCPF } from 'validation-br';
isCPF('01234567890'); // -> true
isCPF('01234567891'); // -> false

// Importe de submódulos
import { dv, fake, mask, validate } from 'validation-br/dist/cpf';

// Calculo do dígito verificador de um CPF. Os métodos aceitam inteiros e strings, inclusive com máscaras.
dv(906259666); // -> '51'
dv('906259666'); // -> '51'
dv('906.259.666'); // -> '51'

// Cria um número fake de CPF para fins de testes.
fake(); // -> 90625966651
// Passe um parâmetro true para gerar o número com máscara
fake(true); // -> 906.259.666-51

// Aplique uma máscara a um cpf
mask(90625966651); // -> 906.259.666-51

// Normalize o número do documento
normalize('906.259.666-51'); // -> 90625966651

// Valida um número e retorna exceção se a validação falhar
validateOrFail('01234567890'); // -> true
```

## Tabela de Conteúdo

### Funções de Validação

- [CNH](#cnh) - Validação do CNH
- [CPF](#cpf) - Validação do CPF
- [CNPJ](#cnpj) - Validação do CNPJ
- [NUP-17](#nup-17) - Validação de Número Unificado de Protocolo do Governo Federal
- [Processo Judicial](#processos-judiciais) - Validação de Números de Processos Judiciais
- [PIS](#pis) - Validação de PIS, PASEP, NIS e NIT
- [Código de Rastreamento Postal](#código-de-rastreamento-postal-dos-correios) - Validação de Objetos Registrados dos Correios
- [Renavam](#renavam) - Validação de RENAVAM
- [Titulo de Eleitor](#título-de-eleitor) - Validação do Título de Eleitor

## Usando em outras bibliotecas de validação

`Validation-BR` pode ser utilizado em conjunto com quaisquer bibliotecas de validação que permita estender seus métodos.
Abaixo seguem alguns exemplos. Sinta-se convidado a adicionar a sua biblioteca favorita em nosso wiki.

- [Vuelidate](https://github.com/klawdyo/validation-br/wiki/Vuelidate) - Usado para validação de estado no vuejs
- [Class-Validator](https://github.com/klawdyo/validation-br/wiki/ClassValidator) - Usado em nest, typeorm E mais uma infinidade de frameworks
- [Indicative](https://github.com/klawdyo/validation-br/wiki/Indicative) - Indicative é a biblioteca padrão de validação usada no Adonis.
- [Joi](https://github.com/klawdyo/validation-br/wiki/Joi) - Joi é um validador de esquemas usado em aplicações node, react, vue etc.
- [Yup](https://github.com/klawdyo/validation-br/wiki/Yup) - Yup é usado para validar estado em aplicações react.

## CNH

Valida o documento da carteira nacional de habilitação.

```js
// Importação direta
import { isCNH } from 'validation-br';
isCNH('69044271146'); //-> true
isCNH('62472927637'); //-> true
isCNH('46190476839'); //-> false

// Importação do submódulo
import { validate, mask, normalize, fake, dv } from 'validation-br/dist/cnh';

// Valida
validate('624729276-37'); //-> true
validateOrFail('62472927637'); //-> true

// Número fake com e sem máscara
fake(); // -> 62472927637
fake(true); // -> 624729276-37

// Aplica uma máscara
mask('62472927637'); // -> 624729276-37

// Normalize o número do documento
normalize('624729276-37'); // -> 62472927637

// Calcula o DV
dv('624729276'); // -> '37'
```

## CNPJ

Valida um CNPJ **numérico** e **alfanumérico**.

> **Primeira biblioteca a inserir o suporte ao CNPJ alfanumérico.**
>
> A partir da [Nota Técnica conjunta COCAD/SUARA/RFB nº 49 de 14 de maio de 2024](https://github.com/user-attachments/files/15851229/Nota.COCAD.SUARA.2024.05.49.CNPJ.Alfanumerico-1.pdf), os números de CNPJ poderão ser alfanuméricos. A alteração entra em uso em 2026.

```js
// Importação direta
import { isCNPJ } from 'validation-br';
isCNPJ('73.797.980/0001-79'); //-> true
isCNPJ('55585709000198'); //-> true
isCNPJ('99362238000180'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/cnpj';

// Valida

validate('99362238000180'); //-> true
validateOrFail('99362238000180'); //-> true

// Número fake com e sem máscara
fake(); // -> 55585709000198
fake(true); // -> 55.585.709/0001-98
fake({ withMask: true }); // -> 55.585.709/0001-98
fake({ withMask: true, alphanumeric: true }); // -> A1.222.333/0001-50
fake({ withMask: false, alphanumeric: true }); // -> A1222333/0001-50

// Aplica uma máscara
mask('99362238000180'); // -> 99.362.238/0001-80

// Normalize o número do documento
normalize('99.362.238/0001-80'); // -> 99362238000180

// Calcula o DV
dv('993622380001'); // -> '80'
```

## CPF

Valida um CPF

```js
// Importação direta
import { isCPF } from 'validation-br';
isCPF('01234567890'); //-> true
isCPF('012.345.678-90'); //-> true
isCPF('01234567891'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/cpf';

// Valida
validate('01234567890'); //-> true
validateOrFail('01234567890'); //-> true

// Número fake com e sem máscara
fake(); // -> 01234567891
fake(true); // -> 012.345.678-91

// Aplica uma máscara
mask('01234567890'); // -> 012.345.678-90

// Normalize o número do documento
normalize('012.345.678-90'); // -> 01234567890

// Calcula o DV
dv('012345678'); // -> '90'
```

## Processos Judiciais

Valida números de processo da esfera judicial. Esta padronização foi adotada em 2010 e de lá para cá todos os processos judiciais abertos no país seguem o mesmo padrão, seja eleitoral, cível, militar etc.

O número é composto por 6 partes:

1. Número sequencial dado pelo órgão de registro, reiniciado a cada ano, com até 7 caracteres
2. Dígito verificador com 2 caracteres
3. Ano de registro com 4 caracteres
4. Órgão do poder judiciário com 1 caractere, sendo eles:

   - 1 - Supremo Tribunal Federal
   - 2 - Conselho Nacional de Justiça
   - 3 - Superior Tribunal de Justiça
   - 4 - Justiça Federal
   - 5 - Justiça do Trabalho
   - 6 - Justiça Eleitoral
   - 7 - Justiça Militar da União
   - 8 - Justiça dos Estados e do Distrito Federal e Territórios
   - 9 - Justiça Militar Estadual

5. Tribunal do segmento do poder judiciário com 2 caracteres
6. Código da unidade de origem do processo com 4 caracteres

```js
// Importação direta
import { isJudicialProcess } from 'validation-br';
isJudicialProcess('20802520125150049'); //-> true
isJudicialProcess('0011006-07.2016.8.20.0100'); //-> true
isJudicialProcess('00110060720168200101'); //-> false

// Importação do submódulo
import {
  validate,
  mask,
  dv,
  normalize,
  fake,
  validateOrFail,
} from 'validation-br/dist/judicialProcess';

validate('00110060720168200100'); //-> true
validateOrFail('00110060720168200100'); //-> true

// Número fake com e sem máscara
fake(); // -> 00110060720168200100
fake(true); // -> 0011006-07.2016.8.20.0100

// Aplica uma máscara
mask('00110060720168200100'); // -> 0011006-07.2016.8.20.0100

// Normalize o número do documento
normalize('0011006-07.2016.8.20.0100'); // -> 00110060720168200100

// Calcula o DV.
// Obs.: Antes do cálculo, é necessário que o número do processo não possua o dígito verificador para que o resultado seja correto. Isso é necessário pois o DV fica no meio da numeração, na posição 8 e 9.
dv('001100620168200100'); // -> '07'
```

## NUP-17

Válida um Número Unificado de Protocolo de 17 dígitos. Esta numeração é usada pelo Governo Federal como forma única de numerar processos em todas os órgãos do executivo.

1. Os primeiros 5 dígitos correspondem código do órgão
2. Os dígitos de 6 a 11 são um número sequencial dado pelo órgão em questão e é reiniciado a cada ano
3. Os dígitos 12 a 15 representam o ano de registro do protocolo
4. Os caracteres 16 a 17 são o dígito verificador

```js
// Importação direta
import { isNUP17 } from 'validation-br';
isNUP17('23037001462202165'); //-> true
isNUP17('23037.001462/2021-65'); //-> true
isNUP17('23037.001462/2021-66'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/nup17';

// Valida
validate('23037.001462/2021-65'); //-> true
validateOrFail('23037.001462/2021-65'); //-> true

// Número fake com e sem máscara
fake(); // -> 23037001462202165
fake(true); // -> 23037.001462/2021-65

// Aplica uma máscara
mask('23037001462202165'); // -> 23037.001462/2021-65

// Normalize o número do documento
normalize('23037.001462/2021-65'); // -> 23037001462202165

// Calcula o DV
dv('230370014622021'); // -> '65'
```

## PIS

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação direta
import { isPIS } from 'validation-br';
isPIS('71282677380'); //-> true
isPIS('237.95126.95-5'); //-> true
isPIS('500.12973.80-1'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/pisPasep';

// Valida
validate('71282677380'); //-> true
validateOrFail('71282677380'); //-> true

// Número fake com e sem máscara
fake(); // -> 71282677380
fake(true); // -> 712.82677.38-0

// Normalize o número do documento
normalize('712.82677.38-0'); // -> 71282677380

// Aplica uma máscara
mask('71282677380'); // -> 712.82677.38-0

// Calcula o DV
dv('7128267738'); // -> '0'
```

## Código de Rastreamento Postal dos Correios

Valida um código de rastreamento de objetos postais no formato XX00000000DYY, onde:

- XX: O código do objeto postal com 2 dígitos;
- 00000000: Número sequencial do objeto com 8 dígitos;
- D: Dígito Verificador
- YY: País de origem do objeto com 2 dígitos.

```js
// Importação direta
import { isPostalCode } from 'validation-br';
isPostalCode('PN718252423BR'); //-> true
isPostalCode('RY728187035CN'); //-> true
isPostalCode('JT194624698BR'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/postalCode';

// Valida
validate('PN718252423BR'); //-> true
validateOrFail('PN718252423BR'); //-> true

// Número fake com e sem máscara.
fake(); // -> PN718252423BR
fake(true); // -> PN718252423BR

// Aplica uma máscara
// No caso de PostalCode, a máscara apenas coloca as letras em maiúsculas, servindo como normalização
mask('pn718252423br'); // -> PN718252423BR

// Normalize o número do documento
normalize('pn718252423br'); // -> PN718252423BR

// Calcula o DV
dv('PN718252423BR'); // -> '3'
```

## RENAVAM

Valida o número de um RENAVAM de 11 dígitos

```js
// Importação direta
import { isRenavam } from 'validation-br';
isRenavam('14283256656'); //-> true
isRenavam('95059845976'); //-> true
isRenavam('67747331626'); //-> false

// ou
// Importação do submódulo
import { validate, mask, dv, normalize, fake, validateOrFail } from 'validation-br/dist/renavam';

// Valida
validate('95059845976'); //-> true
validateOrFail('95059845976'); //-> true

// Número fake com e sem máscara
fake(); // -> 95059845976
fake(true); // -> 9505984597-6

// Normaliza o número do documento
normalize('9505984597-6'); // -> 95059845976

// Aplica uma máscara
mask('95059845976'); // -> 9505984597-6

// Calcula o DV
dv('950598459'); // -> '76'
```

## Título de Eleitor

Valida um título eleitoral

```js
// Importação direta
import { isTituloEleitor } from 'validation-br';
isTituloEleitor('743650641660'); //-> true
isTituloEleitor('525028881694'); //-> true
isTituloEleitor('153016161686'); //-> false

// Importação do submódulo
import {
  validate,
  mask,
  dv,
  normalize,
  fake,
  validateOrFail,
} from 'validation-br/dist/tituloEleitor';

// Valida
validate('01234567890'); //-> true
validateOrFail('01234567890'); //-> true

// Número fake com e sem máscara
fake(); // -> 153016161686
fake(true); // -> 1530.1616.1686

// Normalize o número do documento
normalize('1530.1616.1686'); // -> 153016161686

// Aplica uma máscara
mask('525028881694'); // -> 5250.2888.1694

// Calcula o DV
dv('5250288816'); // -> '94'
```

# Testes

Todos os testes passando com 100% de cobertura

![Testes passando com 100% de cobertura](https://github.com/user-attachments/assets/195a6acb-3a8a-4370-b503-184b8240fe66)

# Github Actions

Github actions executados nas versões 18, 20 e 22 do Node.

![Github actions executados nas versões 18, 20 e 22 do Node](https://github.com/user-attachments/assets/72799ba2-757c-497a-b958-b2de948fd666)

# Changelog

- **25/12/2025**:
  - 1.6.0
    - Incluída a função normalize() que retorna o valor normalizado, somente números (ou letras maiúsculas quando couber).
- **16/12/2023**:
  - 1.5.0
    - CNPJ alfanumérico
    - Removidos github actions dos node 12, 14 e 16 e acrescentado o 22
- **16/12/2023**:
  - 1.4.5
    - Corrige o caminho da definição dos types. (Thanks @ishigami)
- **30/12/2022**:
  - 1.4.4
    - Correção de bug quando o documento válido tinha caracteres adicionais
    - Refatoração de `clearValue()` para comportar configurações opcionais
- **01/10/2022**:
  - 1.4.1
    - Correção na importação principal dos módulos
    - Refatoração do isJudicialProcess para permitir 100% de cobertura dos testes
    - Inclusão de mais testes unitários para atingir 100% de cobertura
- **10/01/2022**:
  - 1.1.0 - Adicionado NUP17 - Número Unificado de Protocolo de 17 dígitos do Governo Federal
- **09/01/2022**:
  - 1.0.0 - Biblioteca convertida para Typescript e testes convertidos para Jest
- **08/01/2022**:
  - 0.21.1 - Adicionadas as funções isRenavam e isJudicialProcess
- **16/09/2021**:
  - 0.5.0 - Adicionadas as funções isCPF, isCNPJ e isTituloEleitor
  - 0.7.0 - Adicionadas as funções isPostalCode e isCNH
  - 0.8.0 - Adicionada a função isPIS

# Referências

- [Cálculo do DV do CPF](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/)
- [Cálculo do DV do CNPJ](http://www.macoratti.net/alg_cnpj.htm)
- [Cálculo do DV do Título Eleitoral](http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-titulo-de-eleitor/)
- [Cálculo do PIS](http://www.macoratti.net/alg_pis.htm)
- [Diferença entre PIS, PASEP, NIS e NIT](https://www.jornalcontabil.com.br/entenda-de-uma-vez-a-diferenca-entre-pis-pasep-nit-e-nis/#:~:text=NIS%20%E2%80%93%20N%C3%BAmero%20de%20Identifica%C3%A7%C3%A3o%20Social,do%20Patrim%C3%B4nio%20do%20Servidor%20P%C3%BAblico)
- [Documentação Oficial de Numeração de Processos Judiciais](https://juslaboris.tst.jus.br/bitstream/handle/20.500.12178/30318/2008_res0065_cnj_rep01.pdf?sequence=2)
- [Cálculos de DV](http://ghiorzi.org/DVnew.htm)
- [Cálculo do NUP17](https://www.gov.br/compras/pt-br/acesso-a-informacao/legislacao/portarias/portaria-interministerial-no-11-de-25-de-novembro-de-2019)
