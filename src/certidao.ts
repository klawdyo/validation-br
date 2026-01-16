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
 */

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

// Classe base fictícia para demonstrar a herança da máscara
class BaseDocumento {
    protected _mask: string = '';
    protected _value: string = '';

    get masked(): string {
        let i = 0;
        return this._mask.replace(/0/g, () => this._value[i++] || '0');
    }
}

export class Certidao extends BaseDocumento {
    protected _mask = '000000 00 00 0000 0 00000 000 0000000 00';

    constructor(numero: string) {
        super();
        this._value = numero;
        this.normalize();
    }

    /**
     * Remove caracteres não numéricos e limita a 32 dígitos
     */
    public normalize(): void {
        this._value = this._value.replace(/\D/g, '').substring(0, 32);
    }

    get value(): string {
        return this._value;
    }

    public toString(): string {
        return this._value;
    }

    /**
     * Calcula o DV para uma sequência de 30 dígitos
     */
    public checksum(base30: string): string {
        if (base30.length !== 30) return '';

        // Cálculo do Primeiro Dígito (DV1)
        let soma1 = 0;
        for (let i = 0; i < 30; i++) {
            soma1 += parseInt(base30[i]) * (31 - i);
        }
        let dv1 = soma1 % 11;
        if (dv1 === 10) dv1 = 1;

        // Cálculo do Segundo Dígito (DV2)
        const base31 = base30 + dv1.toString();
        let soma2 = 0;
        for (let i = 0; i < 31; i++) {
            soma2 += parseInt(base31[i]) * (32 - i);
        }
        let dv2 = soma2 % 11;
        if (dv2 === 10) dv2 = 1;

        return `${dv1}${dv2}`;
    }

    /**
     * Valida se a certidão atual possui o DV correto e tamanho 32
     */
    public validate(): boolean {
        if (this._value.length !== 32) return false;
        const base = this._value.substring(0, 30);
        const dvInformado = this._value.substring(30, 32);
        return this.checksum(base) === dvInformado;
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

        // Instancia temporária para usar o checksum
        const temp = new Certidao(base30 + '00');
        const dv = temp.checksum(base30);

        return new Certidao(base30 + dv);
    }
}