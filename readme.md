# validation-br

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ, Título Eleitoral, PIS/PASEP, CNH. Também valida numerações de outros tipos de registros como RENAVAM, Processos Judiciais e Objetos registrados de Rastreamento dos Correios.

Validation-BR também permite a criação de números fake das numerações acima para fins de teste de desenvolvimento, além de aplicação de máscaras e cálculo do dígito verificador.

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
const { isCPF, isCNPJ } = require('validation-br');

// ES6
import { isCPF, isCNPJ } from 'validation-br';
```

## Importação de submódulos

Importando os submódulos, é possível criar máscaras, números fake para testes de desenvolvimento e calcular dígitos verificadores.

### Exemplos

```js
// ES6
import { dv, fake, mask, validate } from 'validation-br/cpf';

// Modules
const cpf = require('validation-br/cpf');
const { dv, fake, mask, validate } = require('validation-br/cpf');

// Calculo do dígito verificador de um CPF. Os métodos aceitam inteiros e strings, inclusive com máscaras.
cpf.dv(906259666); // -> '51'
cpf.dv('906259666'); // -> '51'
cpf.dv('906.259.666'); // -> '51'

// Cria um número fake de CPF para fins de testes.
cpf.fake(); // -> 90625966651
// Passe um parâmetro true para gerar o número com máscara
cpf.fake(true); // -> 906.259.666-51

// Aplique uma máscara a um cpf
cpf.mask(90625966651); // -> 906.259.666-51

// Valida um número
cpf.validate('01234567890'); // -> true

// Valida um número e retorna exceção se a validação falhar
cpf.validateOrFail('01234567890'); // -> true
```

## Tabela de Conteúdo

- [isCNH](#isCNH-value-) - Validação do CNH
- [isCPF](#isCPF-value-) - Validação do CPF
- [isCNPJ](#isCNPJ-value-) - Validação do CNPJ
- [isPostalCode](#isPostalCode-value-) - Validação de Objetos Registrados dos Correios
- [isJudicialProcess](#isJudicialProcess-value-) - Validação de Números de Processos Judiciais
- [isPIS](#isPIS-value-) - Validação de PIS, PASEP, NIS e NIT
- [isPostalCode](#isPostalCode-value-) - Validação de Objetos Registrados dos Correios
- [isRenavam](#isRenavam-value-) - Validação de RENAVAM
- [isTitulo](#isTitulo-value-) - Validação do Título de Eleitor

### isCNH( `value` )

Valida o documento da carteira nacional de habilitação.

```js
// Importação somente da validação
import { isCNH } from 'validation-br';
// ou
// Importação do submódulo
import cnh from 'validation-br/cnh';

// Valida
isCNH('69044271146'); //-> true
isCNH('62472927637'); //-> true
isCNH('46190476839'); //-> false
cnh.validate('62472927637'); //-> true
cnh.validateOrFail('62472927637'); //-> true

// Número fake com e sem máscara
cnh.fake(); // -> 62472927637
cnh.fake(true); // -> 624729276-37

// Aplica uma máscara
cnh.mask('62472927637'); // -> 624729276-37

// Calcula o DV
cnh.dv('624729276'); // -> '37'
```

### isCNPJ( `value` )

Valida um CNPJ

```js
// Importação somente da validação
import { isCNPJ } from 'validation-br';
// ou
// Importação do submódulo
import cnpj from 'validation-br/cnpj';

// Valida
isCNPJ('73.797.980/0001-79'); //-> true
isCNPJ('55585709000198'); //-> true
isCNPJ('99362238000180'); //-> false
cnpj.validate('99362238000180'); //-> true
cnpj.validateOrFail('99362238000180'); //-> true

// Número fake com e sem máscara
cnpj.fake(); // -> 55585709000198
cnpj.fake(true); // -> 55.585.709/0001-98

// Aplica uma máscara
cnpj.mask('99362238000180'); // -> 99.362.238/0001-80

// Calcula o DV
cnpj.dv('993622380001'); // -> '80'
```

### isCPF( `value` )

Valida um CPF

```js
// Importação somente da validação
import { isCPF } from 'validation-br';
// ou
// Importação do submódulo
import cpf from 'validation-br/cpf';

// Valida
isCPF('01234567890'); //-> true
isCPF('012.345.678-90'); //-> true
isCPF('01234567891'); //-> false
cpf.validate('01234567890'); //-> true
cpf.validateOrFail('01234567890'); //-> true

// Número fake com e sem máscara
cpf.fake(); // -> 01234567891
cpf.fake(true); // -> 012.345.678-91

// Aplica uma máscara
cpf.mask('01234567890'); // -> 012.345.678-90

// Calcula o DV
cpf.dv('012345678'); // -> '90'
```

### isJudicialProcess( `value` )

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação somente da validação
import { isJudicialProcess } from 'validation-br';
// ou
// Importação do submódulo
import judicialProcess from 'validation-br/judicial-process';

// Valida
isJudicialProcess('71282677380'); //-> true
isJudicialProcess('237.95126.95-5'); //-> true
isJudicialProcess('500.12973.80-1'); //-> false
judicialProcess.validate('71282677380'); //-> true
judicialProcess.validateOrFail('71282677380'); //-> true

// Número fake com e sem máscara
judicialProcess.fake(); // -> 71282677380
judicialProcess.fake(true); // -> 712.82677.38-0

// Aplica uma máscara
judicialProcess.mask('71282677380'); // -> 712.82677.38-0

// Calcula o DV
judicialProcess.dv('7128267738'); // -> '0'
```

### isPIS( `value` )

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação somente da validação
import { isPIS } from 'validation-br';
// ou
// Importação do submódulo
import pis from 'validation-br/pis';

// Valida
isPIS('71282677380'); //-> true
isPIS('237.95126.95-5'); //-> true
isPIS('500.12973.80-1'); //-> false
pis.validate('71282677380'); //-> true
pis.validateOrFail('71282677380'); //-> true

// Número fake com e sem máscara
pis.fake(); // -> 71282677380
pis.fake(true); // -> 712.82677.38-0

// Aplica uma máscara
pis.mask('71282677380'); // -> 712.82677.38-0

// Calcula o DV
pis.dv('7128267738'); // -> '0'
```

### isPostalCode( `value` )

Valida um código de rastreamento de objetos postais no formato XX00000000DYY, onde:

- XX: O código do objeto postal com 2 dígitos;
- 00000000: Número sequencial do objeto com 8 dígitos;
- D: Dígito Verificador
- YY: País de origem do objeto com 2 dígitos.

```js
// Importação somente da validação
import { isPostalCode } from 'validation-br';
// ou
// Importação do submódulo
import postalCode from 'validation-br/postal-code';

// Valida
isPostalCode('PN718252423BR'); //-> true
isPostalCode('RY728187035CN'); //-> true
isPostalCode('JT194624698BR'); //-> false
postalCode.validate('PN718252423BR'); //-> true
postalCode.validateOrFail('PN718252423BR'); //-> true

// Número fake com e sem máscara.
postalCode.fake(); // -> PN718252423BR
postalCode.fake(true); // -> PN718252423BR

// Aplica uma máscara
// No caso de PostalCode, a máscara apenas coloca as letras em maiúsculas
postalCode.mask('pn718252423br'); // -> PN718252423BR

// Calcula o DV
postalCode.dv('PN718252423BR'); // -> '3'
```

### isRenavam( `value` )

Valida o número de um RENAVAM de 11 dígitos

```js
// Importação somente da validação
import { isRenavam } from 'validation-br';
// ou
// Importação do submódulo
import renavam from 'validation-br/renavam';

// Valida
isRenavam('14283256656'); //-> true
isRenavam('95059845976'); //-> true
isRenavam('67747331626'); //-> false
renavam.validate('95059845976'); //-> true
renavam.validateOrFail('95059845976'); //-> true

// Número fake com e sem máscara
renavam.fake(); // -> 95059845976
renavam.fake(true); // -> 9505984597-6

// Aplica uma máscara
renavam.mask('95059845976'); // -> 9505984597-6

// Calcula o DV
renavam.dv('950598459'); // -> '76'
```

### isTitulo( `value` )

Valida um título eleitoral

```js
// Importação somente da validação
import { isTitulo } from 'validation-br';
// ou
// Importação do submódulo
import titulo from 'validation-br/titulo';

// Valida
isTitulo('743650641660'); //-> true
isTitulo('525028881694'); //-> true
isTitulo('153016161686'); //-> false
titulo.validate('01234567890'); //-> true
titulo.validateOrFail('01234567890'); //-> true

// Número fake com e sem máscara
titulo.fake(); // -> 153016161686
titulo.fake(true); // -> 1530.1616.1686

// Aplica uma máscara
titulo.mask('525028881694'); // -> 5250.2888.1694

// Calcula o DV
titulo.dv('5250288816'); // -> '94'
```

# Tests

![image](https://user-images.githubusercontent.com/100168/148705204-7c42d5e2-1d17-4ed1-8a4c-7933c9e5aeb5.png)

# Changelog

- **08/01/2022**:
  - 0.21.1 - Adicionadas as funções isRenavam e isJudicialProcess
- **16/09/2021**:
  - 0.5.0 - Adicionadas as funções isCPF, isCNPJ e isTitulo
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
