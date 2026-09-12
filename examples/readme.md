# Exemplos de integração com outras bibliotecas de validação

Cada pasta é um projeto Node independente (com seu próprio `package.json`) que instala a biblioteca de validação de terceiros junto com o `validation-br` (via `file:../..`, apontando para este repositório) e mostra, em um único arquivo, como reaproveitar uma função `isX` do validation-br como regra customizada dessa biblioteca.

Todos os exemplos abaixo foram executados e o resultado de cada `console.log` está documentado no comentário ao lado da linha, no próprio arquivo.

| Biblioteca | Pasta | Onde é usada |
| --- | --- | --- |
| [Joi](https://github.com/hapijs/joi) | [joi/index.js](joi/index.js) | Validação de esquemas em aplicações Node, React, Vue etc. |
| [Yup](https://github.com/jquense/yup) | [yup/index.js](yup/index.js) | Validação de estado em aplicações React (Formik, react-hook-form etc). |
| [Class-Validator](https://github.com/typestack/class-validator) | [class-validator/index.ts](class-validator/index.ts) | NestJS, TypeORM e outros frameworks baseados em decorators. |
| [Indicative](https://github.com/poppinss/indicative) | [indicative/index.js](indicative/index.js) | Biblioteca padrão de validação do AdonisJS. |
| [Vuelidate](https://github.com/vuelidate/vuelidate) | [vuelidate/index.js](vuelidate/index.js) | Validação de estado em aplicações Vue.js. |

## Rodando um exemplo

```sh
cd examples/<biblioteca>
npm install
npm start
```
