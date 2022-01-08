const test = require('tape');
const { isJudicialProcess } = require('../dist/documents');
const {
  fake, mask, dv, validate,
} = require('../dist/documents/judicial-process');
const { validateOrFail } = require('../src/documents/judicial-process');

test('isJudicialProcess() - Processos Judiciais válidos', (t) => {
  const valid = [
    '20802520125150049',
    '61052838320098130024',
    '00110060720168200100',
    '08002785520134058400',
    '08002732820164058400',
  ];

  valid.forEach((key) => {
    t.true(isJudicialProcess(key), `Processo ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Processos Judiciais válidos', (t) => {
  const valid = [
    '20802520125150049',
    '61052838320098130024',
    '00110060720168200100',
    '08002785520134058400',
    '08002732820164058400',
  ];

  valid.forEach((key) => {
    t.true(validate(key), `Processo ${key} deve ser válido`);
  });

  t.end();
});

test('validate() - Processos Judiciais inválidos', (t) => {
  const invalid = [
    '20802520125150044',
    '61052838320098130023',
    '00110060720168200102',
    '08002785520134058401',
    '08002732820164058406',
    '08002732820160058400', // Órgão judiciário igual a 0
  ];

  invalid.forEach((key) => {
    t.false(isJudicialProcess(key), `Processp ${key} deve ser inválido`);
  });

  t.end();
});

test('validateOrFail() - Processos Judiciais inválidos devem lançar erro', (t) => {
  const invalid = [
    '20802520125150044',
    '61052838320098130023',
    '00110060720168200102',
    '08002785520134058401',
    '08002732820164058406',
    '08002732820160058400', // Órgão judiciário igual a 0
  ];

  invalid.forEach((key) => {
    t.throws(() => validateOrFail(key), `Processo ${key} deve lançar exceção`);
  });

  t.end();
});

test('fake() - Gera Processos Judiciais fake sem máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const judicialProcess = fake();
    t.true(validate(judicialProcess), `Processo fake ${judicialProcess} deve ser válido`);
    t.assert(judicialProcess.length === 20, `Processo ${judicialProcess} precisa ter 20 caracteres`);
  }

  t.end();
});

test('fake() - Gera Processos Judiciais fake com máscara', (t) => {
  for (let i = 0; i < 5; i += 1) {
    const judicialProcess = fake(true);
    t.true(validate(judicialProcess), `Processo fake ${judicialProcess} deve ser válido`);
    t.assert(judicialProcess.length === 25, `Processo ${judicialProcess} precisa ter 25 caracteres`);
  }

  t.end();
});

test('dv() - Testando se a DV foi calculado corretamente', (t) => {
  const list = {
    '000208020125150049': '25',
    '610528320098130024': '83',
    '001100620168200100': '07',
    '080027820134058400': '55',
    '080027320164058400': '28',
  };

  Object.keys(list).forEach((key) => {
    t.equal(dv(key), list[key], `${key} deve gerar um DV igual a ${list[key]}`);
  });

  t.end();
});

test('mask() - Testando se a máscara foi gerada corretamente', (t) => {
  const maskedValues = {
    '20802520125150049': '0002080-25.2012.5.15.0049',
    '61052838320098130024': '6105283-83.2009.8.13.0024',
    '00110060720168200100': '0011006-07.2016.8.20.0100',
    '08002785520134058400': '0800278-55.2013.4.05.8400',
    '08002732820164058400': '0800273-28.2016.4.05.8400',
  };

  Object.keys(maskedValues).forEach((key) => {
    t.equal(mask(key), maskedValues[key],
      `${key} com máscara precisa ser igual a ${maskedValues[key]}`);
  });

  t.end();
});
