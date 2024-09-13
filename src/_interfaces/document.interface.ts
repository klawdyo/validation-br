export interface IBRDocument {
  fake?(withMask: boolean | any): string;
  checksum?(value: string): string | null;
  mask(options?: any): string;
  validate(): boolean;
  toString(): string;
}