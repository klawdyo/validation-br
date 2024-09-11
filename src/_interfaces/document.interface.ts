export interface IBRDocument {
  fake?(withMask: boolean | any): string;
  mask(options?: any): string;
  checksum(): string | null;
  validate(): boolean;
}