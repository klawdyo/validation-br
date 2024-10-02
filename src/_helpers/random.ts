export class Random {
  /**
   *
   * Devolve um inteiro aleatório entre um mínimo e um máximo.
   *
   */
  static between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   *
   * Devolve uma letra aleatória
   */
  static alpha(length = 1, isUppercase = false): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
      const index = Random.between(0, letters.length - 1);
      result += letters[index];
    }

    if (isUppercase) return result.toLocaleUpperCase();
    return result;
  }

  static fromArray<T>(array: T[]): T {
    // return array.at(Math.floor(Math.random() * array.length)) as T
    return array.at(Random.between(0, array.length-1)) as T;
  }

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
