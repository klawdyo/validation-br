export class Crockford {
  // Alfabeto Base 32 de Douglas Crockford (32 caracteres)
  private static readonly ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  /**
   * Normaliza a string conforme as regras do SINTER/CIB:
   * 1. Remove pontuação e espaços
   * 2. Converte para Maiúsculas
   * 3. Substitui 'I' e 'L' por '1'
   * 4. Substitui 'O' por '0'
   * 5. Lança erro para o caractere proibido 'U'
   */
  public static normalize(value: string): string {
    if (!value) return "";

    let normalized = value
      .toUpperCase()
      .replace(/[-.\s]/g, ""); // Remove hífens, pontos e espaços

    // Substituições de ambiguidade visual
    normalized = normalized.replace(/[IL]/g, "1");
    normalized = normalized.replace(/O/g, "0");

    // Validação do caractere proibido
    if (normalized.includes("U")) {
      throw new Error("O caractere 'U' é proibido no padrão CIB/SINTER para evitar palavras obscenas.");
    }

    return normalized;
  }

  /**
   * Converte um caractere alfanumérico para seu valor decimal (0-31)
   */
  public static charToInt(char: string): number {
    // Normaliza apenas o caractere para garantir que substituições (como 'i' -> '1') ocorram
    const cleanChar = this.normalize(char);

    if (cleanChar.length !== 1) {
      throw new Error("Deve ser fornecido apenas um caractere.");
    }

    const index = this.ALPHABET.indexOf(cleanChar);

    if (index === -1) {
      throw new Error(`Caractere '${char}' não pertence ao alfabeto Crockford Base32.`);
    }

    return index;
  }

  /**
   * Converte um valor numérico (0-31) para o caractere correspondente
   */
  public static intToChar(value: number): string {
    if (value < 0 || value > 31) {
      throw new Error("O valor deve estar entre 0 e 31 para conversão em Base32.");
    }

    return this.ALPHABET[value];
  }

  /**
   * 
   * Retorna o alfabeto utilizado
   */
  public static getAlphabet(): string;
  public static getAlphabet(options: { returnArray: false }): string;
  public static getAlphabet(options: { returnArray: true }): string[];
  public static getAlphabet(options?: GetAlphabetOptions): string | string[] {
    const { returnArray = false } = options || {};

    if (returnArray) {
      return this.ALPHABET.split('');
    }

    return this.ALPHABET;
  }
}

interface GetAlphabetOptions {
  returnArray?: boolean;
}