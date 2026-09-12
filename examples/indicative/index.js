// Exemplo de integração do validation-br com o Indicative.
// Indicative é a biblioteca padrão de validação usada no AdonisJS.
import { validator } from 'indicative'
import { isCPF } from 'validation-br'

// Registra uma regra customizada "cpf" reaproveitando a validação do validation-br.
validator.extend('cpf', {
  async: false,
  validate(data, field) {
    const value = data.original[field]
    return typeof value === 'string' && isCPF(value)
  },
})

const rules = {
  cpf: 'required|cpf',
}

async function run(cpf) {
  try {
    const value = await validator.validateAll({ cpf }, rules, {
      'cpf.cpf': 'CPF inválido',
    })
    return { valid: true, value }
  } catch (errors) {
    return { valid: false, errors }
  }
}

console.log(await run('906.259.666-51')) // -> { valid: true, value: { cpf: '906.259.666-51' } }
console.log(await run('906.259.666-52')) // -> { valid: false, errors: [...] }
