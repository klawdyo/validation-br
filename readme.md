# validation-br

Biblioteca de validação de documentos pessoais do Brasil com suporte a CPF, CNPJ (numérico e alfanumérico), CAEPF, Título Eleitoral, PIS/PASEP, CNH, Telefone, E-mail, UUID, Placa de Veículo (padrão antigo e Mercosul), Chave Pix e Pix Copia e Cola. Também valida numerações de outros tipos de registros como RENAVAM, Processos Judiciais, Número de Protocolo do Governo Federal, Objetos registrados de Rastreamento dos Correios, CEP, Certidões (matrícula CNJ), Código Imobiliário Brasileiro (CIB/SINTER) e Boleto Bancário (linha digitável e código de barras).

Validation-BR também permite criação de números fake para facilitar o desenvolvimento e testes, além de aplicar máscaras e calcular somente os dígitos verificadores.

O pacote é distribuído com build duplo, compatível tanto com `require` (CommonJS) quanto com `import` (ES Modules).

# Instalação

```sh
# Usando yarn
yarn add validation-br

## OU
# Usando npm
npm install validation-br

```

# Breaking Changes (migrando da 1.x para a 2.0)

A versão 2.0 reescreve a API de cada submódulo: em vez de funções soltas (`validate`, `dv`, `fake`, `mask`, `normalize`), cada documento agora é uma **classe imutável** que já valida o valor no construtor. Ao instanciar, o valor informado já é convertido para o formato interno normalizado e fica disponível em `.value` a partir daí — a instância funciona como um *value object*: pode ser guardada, passada adiante ou usada em qualquer lugar, sempre representando o mesmo documento. As funções `isX` importadas diretamente de `validation-br` (ex.: `isCPF`, `isCNPJ`) continuam funcionando exatamente como antes — a mudança afeta só quem importava os submódulos (`validation-br/cpf`, `validation-br/cnpj` etc).

| 1.x (submódulo) | 2.0 (submódulo) | O que muda |
| --- | --- | --- |
| `validate('01234567890')` → `true`/`false` | `new CPF('01234567890')` → lança `ValidationBRError` se inválido | Não retorna mais `false`; use `try/catch` ou a função `isCPF` se só quiser um booleano |
| `dv('906.259.666')` → `'51'` | `CPF.checksum('906259666')` → `'51'` | `dv()` foi removido, veja "`checksum()` não faz mais suposições sobre o formato" abaixo |
| `fake()` → `'90625966651'` / `fake(true)` → `'906.259.666-51'` | `CPF.fake()` → **instância** de `CPF` | Veja "`fake()` agora retorna uma instância" abaixo |
| `mask('90625966651')` → `'906.259.666-51'` | `new CPF('90625966651').mask()` | Veja "`mask()` agora é método de instância" abaixo |
| `normalize('906.259.666-51')` → `'90625966651'` | `new CPF('906.259.666-51').value` (ou `.toString()`) | Veja "`normalize()` não existe mais" abaixo |
| `import { CPF } from 'validation-br/dist/cpf'` | `import { CPF } from 'validation-br/cpf'` | O caminho perdeu o prefixo `dist/` |

### A classe é imutável (value object)

O valor passado no construtor é validado e convertido para o formato interno normalizado nesse momento — e não muda mais depois disso. A instância pode ser usada em qualquer lugar do código (armazenada, passada como parâmetro, comparada) sempre representando o mesmo documento. Para "alterar" um valor, crie uma nova instância.

```js
const cpf = new CPF('906.259.666-51')
cpf.value // -> '90625966651', sempre o mesmo valor para essa instância
```

### `checksum()` não faz mais suposições sobre o formato

Em 1.x, `dv()` tentava adivinhar o formato do valor recebido: aceitava número ou string, com ou sem máscara, e limpava tudo o que não fosse dígito antes de calcular. Esse comportamento escondia um problema — um valor que perdeu um zero à esquerda (por exemplo, por ter passado por uma conversão numérica em algum ponto do código) podia ser silenciosamente "corrigido" pela função, que só enxergava dígitos e presumia que aquilo era só uma máscara a ser removida, quando na verdade podia ser um valor errado vindo de outro lugar.

Em 2.0, `checksum()` não faz mais nenhuma suposição sobre o formato de entrada: ele espera receber exatamente os dígitos esperados, sem máscara e sem qualquer conversão. Se o valor tiver máscara, limpe-o antes de chamar `checksum()` — a normalização deixou de ser implícita e passou a ser responsabilidade de quem chama. Essa mudança de comportamento é também o motivo do nome ter mudado de `dv()` para `checksum()`: não é um simples apelido novo, é uma função com um contrato diferente.

```js
// 1.x — aceitava número, string, com ou sem máscara
dv(906259666)          // -> '51'
dv('906.259.666')      // -> '51'

// 2.0 — só aceita string, só dígitos
CPF.checksum('906259666')   // -> '51'
CPF.checksum('906.259.666') // -> lança exceção, limpe antes de chamar
```

### `fake()` agora retorna uma instância

Em 1.x, `fake()` retornava direto um número já formatado (ou uma string com máscara, com `fake(true)`). Em 2.0, `fake()` retorna uma **instância válida do documento**, não mais um valor pronto. Isso significa que a instância guarda o valor normalizado e só aplica a formatação sob demanda, através de `.mask()` — não é mais preciso recalcular nada para mudar de formato.

```js
const cpf = CPF.fake()

cpf.value  // -> somente o número, ex.: '90625966651'
cpf.mask() // -> com máscara, ex.: '906.259.666-51'
```

### `mask()` agora é método de instância

`mask()` deixou de ser uma função solta que recebia o valor por parâmetro. Agora é um método da própria instância — só converte o valor que ela já guarda para o formato com máscara, sem receber mais nenhum argumento.

```js
new CPF('90625966651').mask() // -> '906.259.666-51'
```

### `normalize()` não existe mais

Em 1.x, era preciso chamar `normalize()` para tirar a máscara de um valor. Em 2.0 isso deixou de ser necessário: ao criar a instância, o valor já chega normalizado e fica disponível em `.value` (ou `.toString()`).

```js
new CPF('906.259.666-51').value // -> '90625966651'
```

# Importação

## Importação direta

Permite realizar diretamente uma validação a partir do objeto principal

```js
// CommonJS
const { isCPF, isCNPJ } = require('validation-br')

// ES Modules
import { isCPF, isCNPJ } from 'validation-br'
```

## Importação de submódulos

Cada tipo de documento também pode ser importado isoladamente. Os submódulos exportam uma classe cujo construtor já valida o valor informado (lançando uma exceção quando ele for inválido), além de métodos estáticos para gerar valores fake e calcular o dígito verificador.

### Exemplo (CPF)

```js
// ES Modules
import { CPF } from 'validation-br/cpf'

// CommonJS
const { CPF } = require('validation-br/cpf')

// Cria uma instância validando o número. Aceita string com ou sem máscara.
// Lança uma exceção (ValidationBRError) se o valor for inválido.
const cpf = new CPF('906.259.666-51')

// Valor normalizado (sem máscara)
cpf.value // -> '90625966651'
cpf.toString() // -> '90625966651'

// Aplica a máscara
cpf.mask() // -> '906.259.666-51'

// Gera um CPF fake válido (retorna uma instância de CPF)
CPF.fake() // -> CPF { value: '19984337146' }
CPF.fake().mask() // -> '199.843.371-46'

// Calcula o dígito verificador a partir dos 9 primeiros dígitos (sem os DVs)
CPF.checksum('906259666') // -> '51'
```

O mesmo padrão (`new CPF(value)`, `.mask()`, `CPF.fake()`, `CPF.checksum()`) se repete nos demais módulos, trocando `CPF` pela classe correspondente, com pequenas variações documentadas em cada seção abaixo.

## Tabela de Conteúdo

### Funções de Validação (atalho `isX` exportado em `validation-br`)

- [isCNH](#iscnh-value) - Validação do CNH
- [isCNPJ](#iscnpj-value) - Validação do CNPJ
- [isCPF](#iscpf-value) - Validação do CPF
- [isJudicialProcess](#isjudicialprocess-value) - Validação de Números de Processos Judiciais
- [isNUP17](#isnup17-value) - Validação de Número Unificado de Protocolo do Governo Federal
- [isPIS](#ispis-value) - Validação de PIS, PASEP, NIS e NIT
- [isPostalTrackCode](#ispostaltrackcode-value) - Validação de Objetos Registrados dos Correios
- [isRenavam](#isrenavam-value) - Validação de RENAVAM
- [isTituloEleitor](#istituloeleitor-value) - Validação do Título de Eleitor
- [isCarPlate](#iscarplate-value) - Validação de placa de veículo (padrão antigo e Mercosul)
- [isPixKey](#ispixkey-value) - Validação de chave Pix (CPF, CNPJ, e-mail, telefone ou aleatória)
- [isPixCopyPaste](#ispixcopypaste-value) - Validação de Pix Copia e Cola
- [isBoleto](#isboleto-value) - Validação de boleto bancário (linha digitável e código de barras)
- [isCAEPF](#iscaepf-value) - Validação de CAEPF (Cadastro de Atividade Econômica da Pessoa Física)
- [isCEP](#iscep-value) - Validação de CEP e busca de UF pelo CEP
- [isCertidao](#iscertidao-value) - Validação de matrícula de certidão (padrão CNJ, 32 dígitos)
- [isCBISinter](#iscbisinter-value) - Validação do Código Imobiliário Brasileiro (CIB/SINTER)
- [isUF](#isuf-value) - Validação de Unidades Federativas

### Funções auxiliares (dão suporte à validação de chave Pix)

`isEmail`, `isPhone` e `isUUID` foram incluídas para viabilizar a validação de chave Pix (`isPixKey`) — telefone, e-mail e chave aleatória (EVP, um UUID v4) são tipos de chave Pix. Elas também podem ser usadas isoladamente, mas por isso ficam à parte da lista principal.

- [isEmail](#isemail-value) - Validação de e-mail
- [isPhone](#isphone-value) - Validação de telefone brasileiro
- [isUUID](#isuuid-value) - Validação de UUID

### Usando em outras bibliotecas de validação

Validation-BR pode ser utilizado em conjunto com quaisquer bibliotecas de validação que permitam estender seus métodos — basta reaproveitar uma função `isX` do validation-br como regra customizada.

A pasta [examples](examples) traz um projeto funcional para cada biblioteca abaixo, validando um CPF de ponta a ponta:

- [Vuelidate](examples/vuelidate) - Usado para validação de estado no Vue.js
- [Class-Validator](examples/class-validator) - Usado em Nest, TypeORM e mais uma infinidade de frameworks
- [Indicative](examples/indicative) - Biblioteca padrão de validação usada no Adonis
- [Joi](examples/joi) - Validador de esquemas usado em aplicações Node, React, Vue etc.
- [Yup](examples/yup) - Usado para validar estado em aplicações React

Sinta-se convidado a adicionar a sua biblioteca favorita.

### isCNH( `value` )

Valida o documento da carteira nacional de habilitação.

```js
// Importação somente da validação
import { isCNH } from 'validation-br'
// ou
// Importação do submódulo
import { CNH } from 'validation-br/cnh'

// Valida
isCNH('69044271146') //-> true
isCNH('62472927637') //-> true
isCNH('46190476839') //-> false

// Instância (lança exceção se inválido)
const cnh = new CNH('624729276-37')
cnh.value // -> '62472927637'
cnh.mask() // -> '624729276-37'

// Número fake (retorna uma instância de CNH)
CNH.fake() // -> CNH { value: '96054094828' }

// Calcula o DV a partir dos 9 primeiros dígitos
CNH.checksum('624729276') // -> '37'
```

### isCNPJ( `value` )

Valida um CNPJ, numérico ou alfanumérico.

> A partir da [Nota Técnica conjunta COCAD/SUARA/RFB nº 49 de 14 de maio de 2024](https://github.com/user-attachments/files/15851229/Nota.COCAD.SUARA.2024.05.49.CNPJ.Alfanumerico-1.pdf), os números de CNPJ poderão ser alfanuméricos, com entrada em vigor em 2026. O validation-br foi a primeira biblioteca multi-documentos em TypeScript a lançar suporte ao CNPJ alfanumérico.

```js
// Importação somente da validação
import { isCNPJ } from 'validation-br'
// ou
// Importação do submódulo
import { CNPJ } from 'validation-br/cnpj'

// Valida
isCNPJ('73.797.980/0001-79') //-> true
isCNPJ('55585709000198') //-> true
isCNPJ('99362238000180') //-> false

// Instância (lança exceção se inválido)
const cnpj = new CNPJ('55.585.709/0001-98')
cnpj.value // -> '55585709000198'
cnpj.mask() // -> '55.585.709/0001-98'

// Número fake (aceita opções)
CNPJ.fake() // -> CNPJ { value: '40620938000129' }
CNPJ.fake({ alphanumeric: true }).mask() // -> 'WX.BC2.1FX/0001-00'

// Calcula o DV a partir dos 12 primeiros dígitos
CNPJ.checksum('555857090001') // -> '98'
```

### isCPF( `value` )

Valida um CPF

```js
// Importação somente da validação
import { isCPF } from 'validation-br'
// ou
// Importação do submódulo
import { CPF } from 'validation-br/cpf'

// Valida
isCPF('01234567890') //-> true
isCPF('012.345.678-90') //-> true
isCPF('01234567891') //-> false

// Instância (lança exceção se inválido)
const cpf = new CPF('906.259.666-51')
cpf.value // -> '90625966651'
cpf.mask() // -> '906.259.666-51'

// Número fake (retorna uma instância de CPF)
CPF.fake() // -> CPF { value: '19984337146' }

// Calcula o DV a partir dos 9 primeiros dígitos
CPF.checksum('906259666') // -> '51'
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
import { JudicialProcess } from 'validation-br/judicial-process'

// Valida
isJudicialProcess('20802520125150049') //-> true
isJudicialProcess('0011006-07.2016.8.20.0100') //-> true
isJudicialProcess('00110060720168200101') //-> false

// Instância (lança exceção se inválido)
const processo = new JudicialProcess('0011006-07.2016.8.20.0100')
processo.value // -> '00110060720168200100'
processo.mask() // -> '0011006-07.2016.8.20.0100'

// Número fake (aceita opções, ex.: { court, subCourt })
JudicialProcess.fake() // -> JudicialProcess { value: '70795820720189107908' }

// Calcula o DV.
// Obs.: Antes do cálculo, é necessário que o número do processo não possua o dígito
// verificador para que o resultado seja correto, pois o DV fica no meio da numeração,
// na posição 8 e 9.
JudicialProcess.checksum('001100620168200100') // -> '07'
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
import { NUP17 } from 'validation-br/nup17'

// Valida
isNUP17('23037001462202165') //-> true
isNUP17('23037.001462/2021-65') //-> true
isNUP17('23037.001462/2021-66') //-> false

// Instância (lança exceção se inválido)
const nup = new NUP17('23037.001462/2021-65')
nup.value // -> '23037001462202165'
nup.mask() // -> '23037.001462/2021-65'

// Número fake (retorna uma instância de NUP17)
NUP17.fake() // -> NUP17 { value: '01724452728274812' }

// Calcula o DV a partir dos 15 primeiros dígitos
NUP17.checksum('230370014622021') // -> '65'
```

### isPIS( `value` )

Valida códigos PIS, PASEP, NIS e NIT, que usam o mesmo algoritmo. Aceita números com e sem pontos e traços.

```js
// Importação somente da validação
import { isPIS } from 'validation-br'
// ou
// Importação do submódulo
import { PIS } from 'validation-br/pis-pasep'

// Valida
isPIS('71282677380') //-> true
isPIS('237.95126.95-5') //-> true
isPIS('500.12973.80-1') //-> false

// Instância (lança exceção se inválido)
const pis = new PIS('712.82677.38-0')
pis.value // -> '71282677380'
pis.mask() // -> '712.82677.38-0'

// Número fake (retorna uma instância de PIS)
PIS.fake() // -> PIS { value: '71476809745' }

// Calcula o DV a partir dos 10 primeiros dígitos
PIS.checksum('7128267738') // -> '0'
```

### isPostalTrackCode( `value` )

Valida um código de rastreamento de objetos postais no formato XX00000000DYY, onde:

- XX: O código do objeto postal com 2 dígitos;
- 00000000: Número sequencial do objeto com 8 dígitos;
- D: Dígito Verificador
- YY: País de origem do objeto com 2 dígitos.

```js
// Importação somente da validação
import { isPostalTrackCode } from 'validation-br'
// ou
// Importação do submódulo
import { PostalTrackCode } from 'validation-br/postal-track-code'

// Valida
isPostalTrackCode('PN718252423BR') //-> true
isPostalTrackCode('RY728187035CN') //-> true
isPostalTrackCode('JT194624698BR') //-> false

// Instância (lança exceção se inválido)
const postal = new PostalTrackCode('PN718252423BR')
postal.value // -> 'PN718252423BR'
postal.mask() // -> 'PN718252423BR' (apenas normaliza para maiúsculas)

// Número fake (retorna uma instância de PostalTrackCode)
PostalTrackCode.fake() // -> PostalTrackCode { value: 'AB123456783BR' }

// Calcula o DV a partir dos 8 dígitos numéricos (sem letras, sem DV e sem país)
PostalTrackCode.checksum('71825242') // -> '3'
```

### isRenavam( `value` )

Valida o número de um RENAVAM de 11 dígitos

```js
// Importação somente da validação
import { isRenavam } from 'validation-br'
// ou
// Importação do submódulo
import { Renavam } from 'validation-br/renavam'

// Valida
isRenavam('14283256656') //-> true
isRenavam('95059845976') //-> true
isRenavam('67747331626') //-> false

// Instância (lança exceção se inválido)
const renavam = new Renavam('95059845976')
renavam.value // -> '95059845976'
renavam.mask() // -> '9505984597-6'

// Número fake (retorna uma instância de Renavam)
Renavam.fake() // -> Renavam { value: '95059845976' }

// Calcula o DV a partir dos 10 primeiros dígitos
Renavam.checksum('9505984597') // -> '6'
```

### isTituloEleitor( `value` )

Valida um título eleitoral

```js
// Importação somente da validação
import { isTituloEleitor } from 'validation-br'
// ou
// Importação do submódulo
import { TituloEleitor } from 'validation-br/tituloEleitor'

// Valida
isTituloEleitor('743650641660') //-> true
isTituloEleitor('525028881694') //-> true
isTituloEleitor('153016161686') //-> false

// Instância (lança exceção se inválido)
const titulo = new TituloEleitor('5250.2888.1694')
titulo.value // -> '525028881694'
titulo.mask() // -> '5250.2888.1694'

// Número fake (retorna uma instância de TituloEleitor)
TituloEleitor.fake() // -> TituloEleitor { value: '145023391279' }

// Calcula o DV a partir dos 10 primeiros dígitos
TituloEleitor.checksum('5250288816') // -> '94'
```

### isCarPlate( `value` )

Valida placas de veículos brasileiras, tanto no padrão antigo (`ABC1234`) quanto no padrão Mercosul (`ABC1D23`).

```js
// Importação somente da validação
import { isCarPlate } from 'validation-br'
// ou
// Importação do submódulo
import { CarPlate } from 'validation-br/carplate'

// Valida
isCarPlate('ABC1234') //-> true
isCarPlate('ABC1D23') //-> true
isCarPlate('AB1234') //-> false

// Instância (lança exceção se inválido)
const placa = new CarPlate('ABC1D23')
placa.value // -> 'ABC1D23'
placa.mask() // -> 'ABC-1D23'

// Placa fake (retorna uma instância de CarPlate)
CarPlate.fake() // -> CarPlate { value: 'SSQ1Y19' }
```

> `CarPlate` não possui `checksum()` — placas brasileiras não têm dígito verificador.

### isPixKey( `value` )

Valida uma chave Pix, reconhecendo automaticamente o tipo (CPF, CNPJ, e-mail, telefone ou chave aleatória/EVP).

```js
// Importação somente da validação
import { isPixKey } from 'validation-br'
// ou
// Importação do submódulo
import { PixKey } from 'validation-br/pix-key'

// Valida (aceita CPF, CNPJ, e-mail, telefone ou chave aleatória)
isPixKey('906.259.666-51') //-> true
isPixKey('foo@bar.com') //-> true

// Instância (lança exceção se inválido)
const key = new PixKey('906.259.666-51')
key.value // -> '90625966651'
key.type // -> 'cpf'

// Chave fake (aceita { type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'evp' })
PixKey.fake() // -> PixKey { value: '...' }
PixKey.fake({ type: 'email' }).value // -> 'wqdbzdhkmp@hotmail.com'
```

### isPixCopyPaste( `value` )

Valida uma string de Pix Copia e Cola (BR Code), incluindo o CRC16 ao final.

```js
// Importação somente da validação
import { isPixCopyPaste } from 'validation-br'
// ou
// Importação do submódulo
import { PixCopyPaste } from 'validation-br/pix-copy-paste'

const pix = '00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/b411f5c8-e97f-4a18-af0e-fc66491748d7520400005303986540510.005802BR5925DIOGO DA SILVA SANTOS LTD6014RIO DE JANEIRO622905251e3afd7926983f8ffe086cdc16304FF60'

// Valida
isPixCopyPaste(pix) //-> true

// Instância (lança exceção se inválido)
const copyPaste = new PixCopyPaste(pix)
copyPaste.value // -> string original (sem espaços nas pontas)
```

> `PixCopyPaste` não possui `fake()` nem `checksum()` isolado — o CRC16 é validado internamente contra o conteúdo completo da string.

### isBoleto( `value` )

Valida boleto bancário (cobrança), aceitando tanto a linha digitável (47 dígitos) quanto o código de barras (44 dígitos) diretamente no construtor.

```js
// Importação somente da validação
import { isBoleto } from 'validation-br'
// ou
// Importação do submódulo
import { Boleto } from 'validation-br/boleto'

// Valida (aceita linha digitável ou código de barras)
isBoleto('34198.53241 94297.019419 40804.574073 7 16770000123456') //-> true

// Instância a partir da linha digitável, com ou sem máscara
const boleto = new Boleto('34198.53241 94297.019419 40804.574073 7 16770000123456')
boleto.value // -> '34198532419429701941940804574073716770000123456' (o valor normalizado, no formato em que foi informado)

// Ou a partir do código de barras
Boleto.fromBarcode('34197167700001234568532494297019414080457407')

// Sempre devolve o código de barras (44) ou a linha digitável (47),
// independente do formato usado no construtor
boleto.toBarcode() // -> '34197167700001234568532494297019414080457407'
boleto.toString() // -> '34198532419429701941940804574073716770000123456'
boleto.mask() // -> '34198.53241 94297.019419 40804.574073 7 16770000123456'

// Campos comuns a todos os boletos
boleto.bank // -> '341'
boleto.amount // -> 1234.56 (em reais)
boleto.expiresAt // -> Date, ou null se o boleto não tiver vencimento definido
boleto.freeField // -> parte livre (25 dígitos), definida por cada banco e não decomposta por este validador

// Boleto fake (aceita opções: bank, amount, expiresAt)
Boleto.fake({ bank: '341', amount: 1234.56, expiresAt: new Date('2026-12-31') })

// Calcula o DV geral a partir dos 43 dígitos do código de barras SEM o DV
Boleto.checksum('3419167700001234568532494297019414080457407') // -> '7'
```

> O fator de vencimento (usado em `expiresAt`) tem só 4 dígitos e sua contagem já deu uma volta completa: a Febraban reiniciou o fator em 22/02/2025. Como o fator sozinho não indica de qual "era" ele é, este validador usa um corte (fator < 6000 é a era nova, válida até 2038; fator ≥ 6000 é a era antiga, válida até 21/02/2025) — os detalhes estão documentados em `ExpirationFactor`, no código-fonte.

### isCAEPF( `value` )

Valida o CAEPF (Cadastro de Atividade Econômica da Pessoa Física): base do CPF do titular (9 dígitos, sem o DV do CPF) + número de ordem (3 dígitos) + 2 dígitos verificadores.

```js
// Importação somente da validação
import { isCAEPF } from 'validation-br'
// ou
// Importação do submódulo
import { CAEPF } from 'validation-br/caepf'

// Valida
isCAEPF('411.422.600/001-01') //-> true

// Instância (lança exceção se inválido)
const caepf = new CAEPF('411.422.600/001-01')
caepf.value // -> '41142260000101'
caepf.mask() // -> '411.422.600/001-01'

// CAEPF fake (retorna uma instância de CAEPF)
CAEPF.fake() // -> CAEPF { value: '...' }

// Calcula o DV a partir dos 12 primeiros dígitos (base do CPF + número de ordem)
CAEPF.checksum('411422600001') // -> '01'
```

### isCEP( `value` )

Valida um CEP brasileiro e permite descobrir a UF a partir do CEP (ou sortear um CEP de uma UF).

```js
// Importação somente da validação
import { isCEP } from 'validation-br'
// ou
// Importação do submódulo
import { CEP } from 'validation-br/cep'

// Valida
isCEP('59066-090') //-> true

// Instância (lança exceção se inválido)
const cep = new CEP('59066-090')
cep.value // -> '59066090'
cep.mask() // -> '59066-090'

// CEP fake (aceita opções, ex.: { uf: 'RN' })
CEP.fake() // -> CEP { value: '51386528' }

// Descobre a UF a partir do CEP (retorna uma instância de UF)
CEP.getUFByCEP('59066-090').value // -> 'RN'

// Sorteia um CEP válido de uma UF específica
CEP.getRandomByUF(UF.RN) // -> CEP { value: '...' }
```

> `CEP` não possui `checksum()` — CEPs não têm dígito verificador.

### isCertidao( `value` )

Valida o número de matrícula de certidão no padrão do CNJ (32 dígitos: `aaaaaa.bb.cc.dddd.e.fffff.ggg.hhhhhhh-ii`).

```js
// Importação somente da validação
import { isCertidao } from 'validation-br'
// ou
// Importação do submódulo
import { Certidao } from 'validation-br/certidao'

// Valida
isCertidao('104539015520131000120210000123-21') //-> true

// Instância (lança exceção se inválido)
const certidao = new Certidao('104539015520131000120210000123-21')
certidao.value // -> valor normalizado com 32 dígitos
certidao.mask() // -> '104539 01 55 2013 1 00012 021 0000123-21'

// Certidão fake (aceita opções)
Certidao.fake() // -> Certidao { value: '...' }

// Calcula o DV a partir dos 30 primeiros dígitos
Certidao.checksum('827660015520261654035919727867') // -> '31'
```

### isCBISinter( `value` )

Valida o Código Imobiliário Brasileiro (CIB) no padrão SINTER: 7 caracteres alfanuméricos (Base 32 de Crockford) seguidos de um dígito verificador.

```js
// Importação somente da validação
import { isCBISinter } from 'validation-br'
// ou
// Importação do submódulo
import { CBISinter } from 'validation-br/cbi_sinter'

// Valida
isCBISinter('41DNR433') //-> true

// Instância (lança exceção se inválido)
const cib = new CBISinter('41DNR433')
cib.value // -> '41DNR433'
cib.mask() // -> '41DNR43-3'

// Código fake (retorna uma instância de CBISinter)
CBISinter.fake() // -> CBISinter { value: '...' }

// Calcula o DV a partir dos 7 primeiros caracteres
CBISinter.checksum('41DNR43') // -> '3'
```

### isUF( `value` )

Valida siglas de Unidades Federativas e oferece atalhos estáticos para cada estado.

```js
// Importação somente da validação
import { isUF } from 'validation-br'
// ou
// Importação do submódulo
import { UF } from 'validation-br/uf'

// Valida
isUF('RN') //-> true

// Instância (lança exceção se a sigla não existir)
const uf = new UF('RN')
uf.value // -> 'RN'

// Atalhos estáticos para cada estado
UF.RN.value // -> 'RN'
UF.SP.value // -> 'SP'

// Busca os dados completos de uma UF (nome e sigla)
UF.find('RN') // -> { name: 'Rio Grande do Norte', short: 'RN' }

// Lista todas as UFs
UF.getList() // -> [{ name: 'Acre', short: 'AC' }, ...]

// Sorteia uma UF aleatória
UF.getRandom() // -> UF { value: '...' }
```

> `UF` não possui `mask()` (a máscara é o próprio valor) nem `checksum()`.

---

## Funções auxiliares (dão suporte à validação de chave Pix)

`isEmail`, `isPhone` e `isUUID` existem principalmente para viabilizar `isPixKey` — e-mail, telefone e chave aleatória (EVP, um UUID v4) são tipos de chave Pix. Também podem ser usadas isoladamente.

### isEmail( `value` )

Valida um endereço de e-mail.

```js
// Importação somente da validação
import { isEmail } from 'validation-br'
// ou
// Importação do submódulo
import { Email } from 'validation-br/email'

// Valida
isEmail('foo@bar.com') //-> true
isEmail('foo@bar') //-> false

// Instância (lança exceção se inválido)
const email = new Email('Foo@Bar.com')
email.value // -> 'foo@bar.com' (normalizado para minúsculas)

// E-mail fake (retorna uma instância de Email)
Email.fake() // -> Email { value: 'wqdbzdhkmp@hotmail.com' }
```

> `Email` não possui `mask()` nem `checksum()` — chamar `.mask()` lança uma exceção (`Method not implemented`).

### isPhone( `value` )

Valida números de telefone celular e fixo brasileiros, com ou sem DDI (`+55`).

```js
// Importação somente da validação
import { isPhone } from 'validation-br'
// ou
// Importação do submódulo
import { Phone } from 'validation-br/phone'

// Valida
isPhone('+55 (84) 9 9966-2587') //-> true
isPhone('84 9 9966 2587') //-> true
isPhone('(79) 3333698') //-> false

// Instância (lança exceção se inválido)
const phone = new Phone('(11) 98765-4321')
phone.value // -> '+5511987654321'
phone.mask() // -> '11 987654321'
phone.mask({ withCountry: true }) // -> '+55 11 987654321'

// Telefone fake (aceita opções: isMobile, isLandline, ddd)
Phone.fake() // -> Phone { value: '+5541986794955' }
Phone.fake({ isMobile: true, ddd: '84' })
```

> `Phone` não possui `checksum()` — telefones brasileiros não têm dígito verificador.

### isUUID( `value` )

Valida um UUID versão 4 (variante RFC 4122), com ou sem hífens.

> Essa classe existe para validar a chave aleatória do Pix (EVP — Endereço Virtual de Pagamento), e o [Manual de Padrões para Iniciação do Pix](https://github.com/bacen/pix-api/issues/53) do BACEN especifica que essa chave é sempre um UUID v4 (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`). Por isso a validação exige o `4` fixo no terceiro grupo e não aceita as demais versões (v1, v3, v5 etc.) — aceitar um UUID de outra versão como chave Pix seria validar um formato que o BACEN nunca gera nem aceita.

```js
// Importação somente da validação
import { isUUID } from 'validation-br'
// ou
// Importação do submódulo
import { UUID } from 'validation-br/uuid'

// Valida
isUUID('550e8400-e29b-41d4-a716-446655440000') //-> true
isUUID('550e8400e29b41d4a716446655440000') //-> true
isUUID('not-a-uuid') //-> false

// Instância (lança exceção se inválido)
const uuid = new UUID('550e8400-e29b-41d4-a716-446655440000')
uuid.value // -> '550e8400e29b41d4a716446655440000'
uuid.mask() // -> '550e8400-e29b-41d4-a716-446655440000'

// UUID fake (retorna uma instância de UUID)
UUID.fake() // -> UUID { value: '...' }
```

> `UUID` não possui `checksum()` — UUIDs não têm dígito verificador.

# Testes

Todos os testes passando com cobertura próxima de 100%.

![Testes passando com 100% de cobertura](https://github.com/user-attachments/assets/86c75eda-077f-4386-ba9c-20b588b6bd36)


# Github Actions

Github actions executados nas versões 18, 20, 22 e 24 do Node, buildando e validando os pacotes CommonJS e ESM em cada versão.

![Github actions executados nas versões 18, 20 e 22 e 24 do Node](https://github.com/user-attachments/assets/34b2b82d-67e3-4c00-b9c6-7160279123d2)

# Changelog

- **12/09/2026**:
  - Adicionados os atalhos `isBoleto`, `isCAEPF`, `isCEP`, `isCertidao`, `isCBISinter` e `isUF`, que faltavam para essas classes
  - Adicionada a pasta [examples](examples), com um projeto funcional testando a integração do validation-br com Joi, Yup, Class-Validator, Indicative e Vuelidate
  - Breaking Changes reescrito: explica em mais detalhes por que `dv()` virou `checksum()` (deixou de fazer suposições sobre o formato de entrada), reforça a imutabilidade das classes (value objects) e remove itens que não eram breaking changes de fato (UUID e CNPJ alfanumérico não existiam como funções na 1.x)
  - Destacado que o validation-br foi a primeira biblioteca multi-documentos em TypeScript a lançar suporte ao CNPJ alfanumérico
  - Corrigida a documentação de `isUUID`/`UUID`: o texto dizia validar UUID v1 a v5, mas o código só aceita v4 (o `4` fixo no terceiro grupo já estava no código, era a documentação que estava errada) — v4 é a versão exigida pelo BACEN para a chave aleatória (EVP) do Pix, motivo pelo qual essa classe existe
- **11/09/2026**:
  - Adicionada a validação `Boleto` - boleto bancário (linha digitável e código de barras)
  - Adicionada a validação `CAEPF` - Cadastro de Atividade Econômica da Pessoa Física
  - Testes migrados de Jest para Vitest
  - Build passa a gerar CommonJS e ESM lado a lado (`dist/cjs` e `dist/esm`), com testes de fumaça consumindo o pacote publicado via `require()` e `import` reais
  - Github Actions atualizado para rodar nas versões 20, 22 e 24 do Node (removida a 18, já fora do ciclo de suporte)
  - Documentação revisada e atualizada com todas as validações disponíveis, incluindo uma seção de Breaking Changes para quem está migrando da 1.x, e correção do caminho de importação dos submódulos (`validation-br/<módulo>`, sem o prefixo `dist/`)
  - Corrige `isUUID`/`UUID`, que aceitava variantes fora do padrão RFC 4122 (o quarto grupo agora precisa começar com 8, 9, a ou b) e letras não hexadecimais (ex.: `x`, `z`) nos demais grupos
- **18/01/2026**:
  - Adicionada a validação `CBISinter` - Código Imobiliário Brasileiro (CIB) no padrão SINTER
- **16/01/2026**:
  - Adicionada a validação `Certidao` - matrícula de certidão no padrão do CNJ (32 dígitos)
- **26/03/2025**:
  - Adicionadas as funções `isEmail` e `isUUID`
- **02/10/2024**:
  - Adicionadas as classes `CEP` (com busca de UF pelo CEP) e `UF`
- **30/09/2024**:
  - Adicionadas as funções `isPixKey` e `isPixCopyPaste`
- **11/09/2024**:
  - Adicionadas as funções `isCarPlate` e `isPhone`
- **16/12/2023**:
  - 1.5.0
    - CNPJ alfanumérico
    - Removidos github actions dos node 12, 14 e 16 e acrescentado o 22
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
- [Cadastro de Atividade Econômica da Pessoa Física (CAEPF)](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/caepf/legislacao)
- [Layout do código de barras de boleto de cobrança (Febraban)](http://portalabbc.org.br/images/content/manual%20operacional.pdf)
- [Formato da chave aleatória (EVP) do Pix - UUID v4](https://github.com/bacen/pix-api/issues/53)
- [Chave aleatória do Pix: o que é, como funciona e é segura?](https://blog.starkbank.com/chave-aleatoria-do-pix/)
- [EVP Pix: entenda o funcionamento e segurança dessa chave](https://www.iugu.com/blog/evp-pix)
