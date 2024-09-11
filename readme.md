# validation-br

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ (numérico e alfanumérico), Título Eleitoral, PIS/PASEP, CNH. Também valida numerações de outros tipos de registros como RENAVAM, Processos Judiciais, Número de Protocolo do Governo Federal e Objetos registrados de Rastreamento dos Correios.

Validation-BR também permite criação de números fake para facilitar o desenvolvimento e testes, além de aplicar máscaras e calcular somente os dígitos verificadores.

# Instalação

```sh
# Usando yarn
yarn add validation-br

## OU
# Usando npm
npm install validation-br

```

# Importação

## Importação direta

Permite realizar diretamente uma validação a partir do objeto principal

```js
// Modules
const { isCPF, isCNPJ } = require('validation-br')

// ES6
import { isCPF, isCNPJ } from 'validation-br'
```

## Importação de submódulos

Importando os submódulos, é possível criar máscaras, números fake para testes de desenvolvimento e calcular dígitos verificadores.

### Exemplos

```js
// ES6
import { dv, fake, mask, validate } from 'validation-br/dist/cpf'
// ou
import * as cpf from 'validation-br/dist/cpf'

// CommonJS
const cpf = require('validation-br/dist/cpf')
const { dv, fake, mask, validate } = require('validation-br/dist/cpf')

// Calculo do dígito verificador de um CPF. Os métodos aceitam inteiros e strings, inclusive com máscaras.
cpf.dv(906259666) // -> '51'
cpf.dv('906259666') // -> '51'
cpf.dv('906.259.666') // -> '51'

// Cria um número fake de CPF para fins de testes.
cpf.fake() // -> 90625966651
// Passe um parâmetro true para gerar o número com máscara
cpf.fake(true) // -> 906.259.666-51

// Aplique uma máscara a um cpf
cpf.mask(90625966651) // -> 906.259.666-51

// Valida um número
cpf.validate('01234567890') // -> true

// Valida um número e retorna exceção se a validação falhar
cpf.validateOrFail('01234567890') // -> true
```

## Tabela de Conteúdo

### Funções de Validação

- [isCNH](#isCNH-value-) - Validação do CNH
- [isCPF](#isCPF-value-) - Validação do CPF
- [isCNPJ](#isCNPJ-value-) - Validação do CNPJ
- [isNUP17](#isNUP17-value-) - Validação de Número Unificado de Protocolo do Governo Federal
- [isJudicialProcess](#isJudicialProcess-value-) - Validação de Números de Processos Judiciais
- [isPIS](#isPIS-value-) - Validação de PIS, PASEP, NIS e NIT
- [isPostalCode](#isPostalCode-value-) - Validação de Objetos Registrados dos Correios
- [isRenavam](#isRenavam-value-) - Validação de RENAVAM
- [isTituloEleitor](#isTituloEleitor-value-) - Validação do Título de Eleitor

### Usando em outras bibliotecas de validação

Validation-BR pode ser utilizado em conjunto com quaisquer bibliotecas de validação que permita estender seus métodos.
Abaixo seguem alguns exemplos. Sinta-se convidado a adicionar a sua biblioteca favorita em nosso wiki.

- [Vuelidate](https://github.com/klawdyo/validation-br/wiki/Vuelidate) - Usado para validação de estado no vuejs
- [Class-Validator](https://github.com/klawdyo/validation-br/wiki/ClassValidator) - Usado em nest, typeorm E mais uma infinidade de frameworks
- [Indicative](https://github.com/klawdyo/validation-br/wiki/Indicative) - Indicative é a biblioteca padrão de validação usada no Adonis.
- [Joi](https://github.com/klawdyo/validation-br/wiki/Joi) - Joi é um validador de esquemas usado em aplicações node, react, vue etc.
- [Yup](https://github.com/klawdyo/validation-br/wiki/Yup) - Yup é usado para validar estado em aplicações react.

### isCNH( `value` )

Valida o documento da carteira nacional de habilitação.

```js
// Importação somente da validação
import { isCNH } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/cnh'
// ou
import * as cnh from 'validation-br/dist/cnh'

// Valida
isCNH('69044271146') //-> true
isCNH('62472927637') //-> true
isCNH('46190476839') //-> false
cnh.validate('62472927637') //-> true
cnh.validateOrFail('62472927637') //-> true

// Número fake com e sem máscara
cnh.fake() // -> 62472927637
cnh.fake(true) // -> 624729276-37

// Aplica uma máscara
cnh.mask('62472927637') // -> 624729276-37

// Calcula o DV
cnh.dv('624729276') // -> '37'
```

### isCNPJ( `value` )

Valida um CNPJ

> A partir da [Nota Técnica conjunta COCAD/SUARA/RFB nº 49 de 14 de maio de 2024](https://github.com/user-attachments/files/15851229/Nota.COCAD.SUARA.2024.05.49.CNPJ.Alfanumerico-1.pdf), os números de CNPJ poderão ser alfanuméricos. A alteração entra em uso em 2026.

```js
// Importação somente da validação
import { isCNPJ } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/cnpj'
// ou
import * as cnpj from 'validation-br/dist/cnpj'

// Valida
isCNPJ('73.797.980/0001-79') //-> true
isCNPJ('55585709000198') //-> true
isCNPJ('99362238000180') //-> false
cnpj.validate('99362238000180') //-> true
cnpj.validateOrFail('99362238000180') //-> true

// Número fake com e sem máscara
cnpj.fake() // -> 55585709000198
cnpj.fake(true) // -> 55.585.709/0001-98
cnpj.fake({ withMask: true}) // -> 55.585.709/0001-98
cnpj.fake({ withMask: true, alphanumeric: true}) // -> A1.222.333/0001-50
cnpj.fake({ withMask: false, alphanumeric: true}) // -> A1222333/0001-50

// Aplica uma máscara
cnpj.mask('99362238000180') // -> 99.362.238/0001-80

// Calcula o DV
cnpj.dv('993622380001') // -> '80'
```

### isCPF( `value` )

Valida um CPF

```js
// Importação somente da validação
import { isCPF } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/cpf'
// ou
import * as cpf from 'validation-br/dist/cpf'

// Valida
isCPF('01234567890') //-> true
isCPF('012.345.678-90') //-> true
isCPF('01234567891') //-> false
cpf.validate('01234567890') //-> true
cpf.validateOrFail('01234567890') //-> true

// Número fake com e sem máscara
cpf.fake() // -> 01234567891
cpf.fake(true) // -> 012.345.678-91

// Aplica uma máscara
cpf.mask('01234567890') // -> 012.345.678-90

// Calcula o DV
cpf.dv('012345678') // -> '90'
```

### isJudicialProcess( `value` )

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
// Importação somente da validação
import { isJudicialProcess } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/judicialProcess'
// ou
import * as judicialProcess from 'validation-br/dist/judicialProcess'

// Valida
isJudicialProcess('20802520125150049') //-> true
isJudicialProcess('0011006-07.2016.8.20.0100') //-> true
isJudicialProcess('00110060720168200101') //-> false
judicialProcess.validate('00110060720168200100') //-> true
judicialProcess.validateOrFail('00110060720168200100') //-> true

// Número fake com e sem máscara
judicialProcess.fake() // -> 00110060720168200100
judicialProcess.fake(true) // -> 0011006-07.2016.8.20.0100

// Aplica uma máscara
judicialProcess.mask('00110060720168200100') // -> 0011006-07.2016.8.20.0100

// Calcula o DV.
// Obs.: Antes do cálculo, é necessário que o número do processo não possua o dígito verificador para que o resultado seja correto. Isso é necessário pois o DV fica no meio da numeração, na posição 8 e 9.
judicialProcess.dv('001100620168200100') // -> '07'
```

### isNUP17( `value` )

Válida um Número Unificado de Protocolo de 17 dígitos. Esta numeração é usada pelo Governo Federal como forma única de numerar processos em todas os órgãos do executivo.

1. Os primeiros 5 dígitos correspondem código do órgão
2. Os dígitos de 6 a 11 são um número sequencial dado pelo órgão em questão e é reiniciado a cada ano
3. Os dígitos 12 a 15 representam o ano de registro do protocolo
4. Os caracteres 16 a 17 são o dígito verificador

```js
// Importação somente da validação
import { isNUP17 } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/nup17'
// ou
import * as nup from 'validation-br/dist/nup17'

// Valida
isNUP17('23037001462202165') //-> true
isNUP17('23037.001462/2021-65') //-> true
isNUP17('23037.001462/2021-66') //-> false
nup.validate('23037.001462/2021-65') //-> true
nup.validateOrFail('23037.001462/2021-65') //-> true

// Número fake com e sem máscara
nup.fake() // -> 71282677380
nup.fake(true) // -> 712.82677.38-0

// Aplica uma máscara
nup.mask('23037001462202165') // -> 23037.001462/2021-65

// Calcula o DV
nup.dv('230370014622021') // -> '65'
```

### isPIS( `value` )

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação somente da validação
import { isPIS } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/pisPasep'
// ou
import * as pis from 'validation-br/dist/pisPasep'

// Valida
isPIS('71282677380') //-> true
isPIS('237.95126.95-5') //-> true
isPIS('500.12973.80-1') //-> false
pis.validate('71282677380') //-> true
pis.validateOrFail('71282677380') //-> true

// Número fake com e sem máscara
pis.fake() // -> 71282677380
pis.fake(true) // -> 712.82677.38-0

// Aplica uma máscara
pis.mask('71282677380') // -> 712.82677.38-0

// Calcula o DV
pis.dv('7128267738') // -> '0'
```

### isPostalCode( `value` )

Valida um código de rastreamento de objetos postais no formato XX00000000DYY, onde:

- XX: O código do objeto postal com 2 dígitos;
- 00000000: Número sequencial do objeto com 8 dígitos;
- D: Dígito Verificador
- YY: País de origem do objeto com 2 dígitos.

```js
// Importação somente da validação
import { isPostalCode } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/postalCode'
// ou
import * as postalCode from 'validation-br/dist/postalCode'

// Valida
isPostalCode('PN718252423BR') //-> true
isPostalCode('RY728187035CN') //-> true
isPostalCode('JT194624698BR') //-> false
postalCode.validate('PN718252423BR') //-> true
postalCode.validateOrFail('PN718252423BR') //-> true

// Número fake com e sem máscara.
postalCode.fake() // -> PN718252423BR
postalCode.fake(true) // -> PN718252423BR

// Aplica uma máscara
// No caso de PostalCode, a máscara apenas coloca as letras em maiúsculas
postalCode.mask('pn718252423br') // -> PN718252423BR

// Calcula o DV
postalCode.dv('PN718252423BR') // -> '3'
```

### isRenavam( `value` )

Valida o número de um RENAVAM de 11 dígitos

```js
// Importação somente da validação
import { isRenavam } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/renavam'
// ou
import * as renavam from 'validation-br/dist/renavam'

// Valida
isRenavam('14283256656') //-> true
isRenavam('95059845976') //-> true
isRenavam('67747331626') //-> false
renavam.validate('95059845976') //-> true
renavam.validateOrFail('95059845976') //-> true

// Número fake com e sem máscara
renavam.fake() // -> 95059845976
renavam.fake(true) // -> 9505984597-6

// Aplica uma máscara
renavam.mask('95059845976') // -> 9505984597-6

// Calcula o DV
renavam.dv('950598459') // -> '76'
```

### isTituloEleitor( `value` )

Valida um título eleitoral

```js
// Importação somente da validação
import { isTituloEleitor } from 'validation-br'
// ou
// Importação do submódulo
import { validate, mask } from 'validation-br/dist/tituloEleitor'
// ou
import * as titulo from 'validation-br/dist/tituloEleitor'

// Valida
isTituloEleitor('743650641660') //-> true
isTituloEleitor('525028881694') //-> true
isTituloEleitor('153016161686') //-> false
titulo.validate('01234567890') //-> true
titulo.validateOrFail('01234567890') //-> true

// Número fake com e sem máscara
titulo.fake() // -> 153016161686
titulo.fake(true) // -> 1530.1616.1686

// Aplica uma máscara
titulo.mask('525028881694') // -> 5250.2888.1694

// Calcula o DV
titulo.dv('5250288816') // -> '94'
```

# Testes

Todos os testes passando com 100% de cobertura

![Testes passando com 100% de cobertura](https://github.com/klawdyo/validation-br/assets/100168/bb83df1e-774c-4a92-bf83-7b451682264e)

# Github Actions

Github actions executados nas versões 18, 20 e 22 do Node.

![Github actions executados nas versões 12, 14, 16, 18 e 20 do Node](https://github.com/klawdyo/validation-br/assets/100168/50f5b3c3-f1b0-46ac-a6b1-e31a366b27c7)

# Changelog

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
