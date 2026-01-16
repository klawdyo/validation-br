import { Certidao, CertidaoServico, CertidaoTipoLivro } from '../src/certidao';
import { InvalidChecksumException } from '../src/_exceptions/ValidationBRError';

describe('Certidao Class', () => {

    test('deve normalizar o valor no construtor', () => {
        // Gera um válido
        const fake = Certidao.fake();
        // Formata manualmente para testar a remoção
        const formatted = fake.value.replace(/^(\d{6})(\d{2})(\d{2})/, '$1.$2-$3-'); // formatação parcial

        const cert = new Certidao(formatted);
        expect(cert.value).not.toContain('.');
        expect(cert.value).not.toContain('-');
        expect(cert.value).toBe(fake.value);
    });

    test('deve validar uma matrícula correta', () => {
        const fake = Certidao.fake();
        expect(fake.validate()).toBe(true);
    });

    test('deve lançar exceção para matrícula com DV errado', () => {
        // 32 dígitos, mas final 99 provavelmente inválido para este prefixo
        const invalid = '12345601552023100001001000000199';
        expect(() => new Certidao(invalid)).toThrow(InvalidChecksumException);
    });

    test('deve aplicar a máscara corretamente', () => {
        // Usar um válido para não lançar erro
        const fake = Certidao.fake();
        const v = fake.value;
        // Máscara: 000000 00 00 0000 0 00000 000 0000000 00
        //          012345 67 89 0123 4 56789 012 3456789 01
        const expected = `${v.substring(0, 6)} ${v.substring(6, 8)} ${v.substring(8, 10)} ${v.substring(10, 14)} ${v.substring(14, 15)} ${v.substring(15, 20)} ${v.substring(20, 23)} ${v.substring(23, 30)} ${v.substring(30, 32)}`;

        expect(fake.mask()).toBe(expected);
    });

    test('o método fake deve respeitar os parâmetros fornecidos', () => {
        const anoPretendido = 1995;
        const cert = Certidao.fake({
            ano: anoPretendido,
            servico: CertidaoServico.RegistroImoveis
        });

        expect(cert.value.substring(10, 14)).toBe('1995');
        expect(cert.value.substring(8, 10)).toBe(CertidaoServico.RegistroImoveis);
        expect(cert.validate()).toBe(true);
    });

    test('deve retornar string pura no toString()', () => {
        const fake = Certidao.fake();
        expect(fake.toString()).toBe(fake.value);
    });

    test('checksum estático deve calcular corretamente', () => {
        // Teste direto do método estático
        const base30 = '123456015520231000010010000001';
        const dv = Certidao.checksum(base30);
        expect(dv.length).toBe(2);
        // Validar que o DV gerado cria um par válido
        const cert = new Certidao(base30 + dv);
        expect(cert.validate()).toBe(true);
    });
});