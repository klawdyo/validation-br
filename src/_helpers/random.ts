export class Random {
  /**
   * Devolve um inteiro aleatório entre um mínimo e um máximo.
   */
  static between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Devolve um texto aleatório
   */
  static alpha(length = 1, isUppercase = false, isHex = false): string {
    const letters = isHex ? '0123456789abcdef' : 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
      const index = Random.between(0, letters.length - 1);
      result += letters[index];
    }

    if (isUppercase) return result.toLocaleUpperCase();
    return result;
  }

  /**
   * Seleciona um item de um array aleatoramente
   * 
   * @example
   * const array = [1, 2, 3, 4, 5];
   * 
   * const singleItem = Random.fromArray(array); // Pode retornar 1, 2, 3, 4 ou 5
   * const multipleItems = Random.fromArray(array, 3); // Pode retornar [1, 2, 3], [4, 5, 1], etc.
   * 
   * 
   */
  static fromArray<T>(array: T[], length: number): T[];
  static fromArray<T>(array: T[], length?: 1): T;
  static fromArray<T>(array: T[], length: number = 1): T | T[] {
    const _get = (): T => array.at(Random.between(0, array.length - 1)) as T;

    if (length === 1) return _get();

    const result: T[] = [];
    for (let i = 0; i < length; i++) {
      const item = _get();
      if (item !== undefined) {
        result.push(item);
      }
    }

    return result as unknown as T;
  }

  /**
   * Cria um número aleatório com a quantidade definida de caracteres
   */
  static number(length: number, forceLength = false, isAlpha = false): string {
    let value: string;

    if (isAlpha)
      value = Math.round(Math.random() * 36 ** length)
        .toString(36)
        .toLocaleUpperCase();
    else value = Math.floor(Math.random() * 10 ** length).toString();

    if (forceLength) return String(value).padStart(length, '0');

    return String(value);
  }
}
