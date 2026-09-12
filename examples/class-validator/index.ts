// Exemplo de integração do validation-br com o Class-Validator.
// Class-Validator é usado em NestJS, TypeORM e diversos outros frameworks baseados em decorators.
import 'reflect-metadata'
import {
  registerDecorator,
  validate,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { isCPF } from 'validation-br'

// Cria um decorator @IsCPF() reaproveitando a validação do validation-br.
function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isCPF(value)
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} não é um CPF válido`
        },
      },
    })
  }
}

class CreateUserDto {
  @IsCPF()
  cpf!: string
}

async function run(cpf: string) {
  const dto = new CreateUserDto()
  dto.cpf = cpf

  const errors = await validate(dto)
  return errors.length === 0
    ? { valid: true }
    : { valid: false, message: errors[0].constraints }
}

console.log(await run('906.259.666-51')) // -> { valid: true }
console.log(await run('906.259.666-52')) // -> { valid: false, message: { isCPF: 'cpf não é um CPF válido' } }
