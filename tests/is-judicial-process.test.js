const test = require('tape');
const { isJudicialProcess } = require('../dist/documents');
const {
  fake, mask, dv, validate, validateOrFail,
} = require('../dist/documents/judicial-process');

test('isJudicialProcess() - Processos Judiciais válidos', (t) => {
  [
    '20802520125150049',
    '61052838320098130024',
    '00110060720168200100',
    '08002785520134058400',
    '08002732820164058400',
  ].forEach((key) => {
    t.true(isJudicialProcess(key), `Processo ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Processos Judiciais válidos', (t) => {
  [
    '20802520125150049',
    '61052838320098130024',
    '00110060720168200100',
    '08002785520134058400',
    '08002732820164058400',
  ].forEach((key) => {
    t.true(validate(key), `Processo ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Processos Judiciais inválidos', (t) => {
  [
    '20802520125150044',
    '61052838320098130023',
    '00110060720168200102',
    '08002785520134058401',
    '08002732820164058406',
    '08002732820160058400', // Órgão judiciário igual a 0
  ].forEach((key) => {
    t.false(isJudicialProcess(key), `Processp ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - Processos Judiciais inválidos devem lançar erro', (t) => {
  [
    '20802520125150044',
    '61052838320098130023',
    '00110060720168200102',
    '08002785520134058401',
    '08002732820164058406',
    '08002732820160058400', // Órgão judiciário igual a 0
  ].forEach((key) => {
    t.throws(() => validateOrFail(key),
      `Processo ${key} deve lançar exceção`);
  });

  t.end();
});

test('fake() - Gera Processos Judiciais fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const judicialProcess = fake();

    t.true(validate(judicialProcess),
      `Processo fake ${judicialProcess} deve ser válido`);
    t.assert(judicialProcess.length === 20,
      `Processo ${judicialProcess} precisa ter 20 caracteres`);
  }

  t.end();
});

test('fake() - Gera Processos Judiciais fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const judicialProcess = fake(true);

    t.true(validate(judicialProcess), `Processo fake ${judicialProcess} deve ser válido`);
    t.assert(judicialProcess.length === 25,
      `Processo ${judicialProcess} precisa ter 25 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  [
    { num: '000208020125150049', expected: '25' },
    { num: '610528320098130024', expected: '83' },
    { num: '001100620168200100', expected: '07' },
    { num: '080027820134058400', expected: '55' },
    { num: '080027320164058400', expected: '28' },
  ].forEach((item) => {
    t.equal(dv(item.num), item.expected,
      `${item.num} deve gerar um DV igual a ${item.expected}`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  [
    { num: '20802520125150049', expected: '0002080-25.2012.5.15.0049' },
    { num: '61052838320098130024', expected: '6105283-83.2009.8.13.0024' },
    { num: '00110060720168200100', expected: '0011006-07.2016.8.20.0100' },
    { num: '08002785520134058400', expected: '0800278-55.2013.4.05.8400' },
    { num: '08002732820164058400', expected: '0800273-28.2016.4.05.8400' },
  ].forEach((item) => {
    t.equal(mask(item.num), item.expected,
      `${item.num} com máscara precisa ser igual a ${item.expected}`);
  });

  t.end();
});
