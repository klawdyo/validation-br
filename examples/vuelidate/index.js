// Exemplo de integração do validation-br com o Vuelidate.
// Vuelidate é usado para validação de estado (state) em aplicações Vue.js.
import { reactive, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { isCPF } from 'validation-br'

// Cria uma regra reaproveitando a validação do validation-br.
const cpf = helpers.withMessage('CPF inválido', (value) => isCPF(value))

function validateCPF(cpfValue) {
  const state = reactive({ cpf: cpfValue })
  const rules = computed(() => ({ cpf: { required, cpf } }))
  const v$ = useVuelidate(rules, state)

  return v$.value.$validate().then((valid) => ({
    valid,
    errors: v$.value.cpf.$errors.map((e) => e.$message),
  }))
}

console.log(await validateCPF('906.259.666-51')) // -> { valid: true, errors: [] }
console.log(await validateCPF('906.259.666-52')) // -> { valid: false, errors: ['CPF inválido'] }
