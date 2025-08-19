- [x] isCarPlate

- [x] isPhone

  - https://github.com/VitorLuizC/brazilian-values/blob/master/src/validators/isPhone.ts
  - https://github.com/VitorLuizC/brazilian-values/blob/master/src/validators/isDDD.ts

- ~~[ ] Conta bancária~~

- [x] isPixKey - verifica se é um dos tipos de chaves

- [x] isPixCopyPaste - verifica se é um dos tipos de chaves


- [x] isCEP
  - https://github.com/ogilvieira/validator-brasil/blob/main/src/isCEP.ts
  - @klawdyo/qrdapio

- [x] isUF
  - @klawdyo/qrdapio

- isBoleto
  - Construtor pode receber linha digitável
  - Pra receber o código de barras, use o static fromBarcode()
  - mask() pode devolver a linha digitável ou o código de barras. Por padrão, a linha digitável
  - toString() devolve a linha digitável
  - toBarcode() devolve o código de barras
  - parse() é chamado no início e já separa as partes

- [ ] isCAEPF
  - https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/caepf/legislacao
  - https://github.com/VitorLuizC/brazilian-values/blob/master/src/validators/isCAEPF.ts
  - https://contrafbrasil.org.br/system/uploads/ck/files/PERGUNTAS-E-RESPOSTAS.pdf
