/**
 * DETALHAMENTO DO CÁLCULO DA MATRÍCULA (CNJ - 32 DÍGITOS)
 * ---------------------------------------------------------------------------------
 * A matrícula é composta por 32 algarismos, divididos em 9 blocos:
 * 1. CNS (6 dígitos): Código Nacional da Serventia (Cartório).
 * 2. Acervo (2 dígitos): "01" para próprio, "02" para incorporado.
 * 3. Serviço (2 dígitos): Tipo de registro (ex: 55 para Registro Civil).
 * 4. Ano (4 dígitos): Ano em que o registro foi feito.
 * 5. Tipo de Livro (1 dígito): 1 (Nascimento), 2 (Casamento), etc.
 * 6. Número do Livro (5 dígitos): Sequencial do livro.
 * 7. Número da Folha (3 dígitos): Página do registro.
 * 8. Número do Termo (7 dígitos): Sequencial do registro.
 * 9. DV (2 dígitos): Dígitos verificadores calculados via Módulo 11.
 * * CÁLCULO DO DÍGITO VERIFICADOR (Módulo 11):
 * Para os dois últimos dígitos (DV1 e DV2):
 * * DV1 (31º dígito):
 * - Toma-se os primeiros 30 dígitos.
 * - Multiplica-se cada dígito por pesos decrescentes de 31 a 2.
 * - Soma-se os resultados.
 * - Resto = Soma % 11.
 * - Se Resto < 10, DV1 = Resto. Se Resto == 10, DV1 = 1.
 * * DV2 (32º dígito):
 * - Toma-se os 31 dígitos (30 originais + DV1 calculado).
 * - Multiplica-se cada dígito por pesos decrescentes de 32 a 2.
 * - Soma-se os resultados.
 * - Resto = Soma % 11.
 * - Se Resto < 10, DV2 = Resto. Se Resto == 10, DV2 = 1.
 * ---------------------------------------------------------------------------------
 * 
 * Links:
 * - https://www.arpensp.org.br/noticia/10670
 * - https://www.arpensp.org.br/calculo-de-matricula
 * - https://www.skyinformatica.com.br/produtos/civil/manual2/module_2_6.html
 * - https://atos.cnj.jus.br/files/provimento/provimento_2_27042009_26102012180800.pdf
 * 
 */

import { EmptyValueException, InvalidChecksumException, InvalidFormatException } from './_exceptions/ValidationBRError';
import { Base } from './base';
import { clearValue, sumElementsByMultipliers } from './_helpers/utils';

export enum CertidaoTipoLivro {
    Nascimento = '1',
    Casamento = '2',
    CasamentoReligioso = '3',
    Obito = '4',
    Natimorto = '5',
    Proclamas = '6',
    Outros = '7'
}

export enum CertidaoServico {
    Notas = '51',
    Protesto = '52',
    RegistroImoveis = '53',
    RegistroTitulosDocumentos = '54',
    RegistroCivilPessoasNaturais = '55',
    RegistroContratosMaritimos = '56',
    RegistroDistribuicao = '57'
}

export interface FakeCertidaoOptions {
    cns?: string;
    acervo?: string;
    servico?: CertidaoServico;
    ano?: number;
    tipoLivro?: CertidaoTipoLivro;
    livro?: number;
    folha?: number;
    termo?: number;
}

export class Certidao extends Base {
    protected _mask = '000000 00 00 0000 0 00000 000 0000000 00';

    constructor(protected _value: string) {
        super(_value);
        this.normalize();

        if (!this.validate()) {
            throw new InvalidChecksumException();
        }
    }

    protected normalize(): void {
        this._value = this._value.replace(/([. -])/g, '');
    }

    /**
     * Valida se a certidão atual possui o DV correto e tamanho 32
     */
    public validate(): boolean {
        const certidao = clearValue(this._value, 32, {
            rejectEmpty: true,
            rejectIfLonger: true,
            rejectIfShorter: true,
            rejectEqualSequence: false, // 32 digits can possibly have sequences, though unlikely to be ALL same.
        });

        return Certidao.checksum(certidao.substring(0, 30)) === certidao.substring(30, 32);
    }

    /**
     * Calcula o DV para uma sequência de 30 dígitos
     */
    public static checksum(base30: string): string {
        if (!base30) throw new EmptyValueException();
        if (base30.length !== 30) throw new InvalidFormatException();

        // Pesos de 31 a 2
        const weights1 = Array.from({ length: 30 }, (_, i) => 31 - i);
        const soma1 = sumElementsByMultipliers(base30, weights1);
        let dv1 = soma1 % 11;
        if (dv1 === 10) dv1 = 1;

        // Pesos de 32 a 2
        const base31 = base30 + dv1.toString();
        const weights2 = Array.from({ length: 31 }, (_, i) => 32 - i);
        const soma2 = sumElementsByMultipliers(base31, weights2);
        let dv2 = soma2 % 11;
        if (dv2 === 10) dv2 = 1;

        return `${dv1}${dv2}`;
    }

    /**
     * Gera uma instância de Certidao válida com dados aleatórios ou específicos
     */
    public static fake(options: FakeCertidaoOptions = {}): Certidao {
        const pad = (n: number | string, size: number) => n.toString().padStart(size, '0');

        const cns = options.cns ? pad(options.cns, 6) : pad(Math.floor(Math.random() * 999999), 6);
        const acervo = options.acervo ? pad(options.acervo, 2) : '01';
        const servico = options.servico || CertidaoServico.RegistroCivilPessoasNaturais;
        const ano = options.ano || new Date().getFullYear();
        const tipo = options.tipoLivro || CertidaoTipoLivro.Nascimento;
        const livro = options.livro !== undefined ? pad(options.livro, 5) : pad(Math.floor(Math.random() * 99999), 5);
        const folha = options.folha !== undefined ? pad(options.folha, 3) : pad(Math.floor(Math.random() * 999), 3);
        const termo = options.termo !== undefined ? pad(options.termo, 7) : pad(Math.floor(Math.random() * 9999999), 7);

        const base30 = `${cns}${acervo}${servico}${ano}${tipo}${livro}${folha}${termo}`;
        const dv = Certidao.checksum(base30);

        return new Certidao(base30 + dv);
    }
}