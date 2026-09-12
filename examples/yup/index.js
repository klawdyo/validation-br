// Exemplo de integração do validation-br com o Yup.
// Yup é usado para validar estado em aplicações React (Formik, react-hook-form etc).
import * as yup from 'yup'
import { isCPF } from 'validation-br'

const schema = yup.object({
  cpf: yup.string().required().test('is-cpf', 'CPF inválido', (value) => isCPF(value ?? '')),
})

async function run(cpf) {
  try {
    const value = await schema.validate({ cpf })
    return { valid: true, value }
  } catch (error) {
    return { valid: false, message: error.message }
  }
}

console.log(await run('906.259.666-51')) // -> { valid: true, value: { cpf: '906.259.666-51' } }
console.log(await run('906.259.666-52')) // -> { valid: false, message: 'CPF inválido' }
