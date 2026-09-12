// Exemplo de integração do validation-br com o Joi.
// Joi é um validador de esquemas usado em aplicações Node, React, Vue etc.
import Joi from 'joi'
import { isCPF } from 'validation-br'

// Um método customizado do Joi pode chamar diretamente uma função isX do validation-br.
const cpfSchema = Joi.string().custom((value, helpers) => {
  if (!isCPF(value)) return helpers.error('any.invalid')
  return value
}, 'validação de CPF')

const schema = Joi.object({
  cpf: cpfSchema.required(),
})

function run(cpf) {
  const { error, value } = schema.validate({ cpf })
  return error ? { valid: false, message: error.message } : { valid: true, value }
}

console.log(run('906.259.666-51')) // -> { valid: true, value: { cpf: '906.259.666-51' } }
console.log(run('906.259.666-52')) // -> { valid: false, message: '"cpf" contains an invalid value' }
