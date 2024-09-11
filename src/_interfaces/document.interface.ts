export interface IBRDocument {
  fake?(withMask: boolean | any): string;
  mask(): string;
  checksum(): string | null;
  validate(): boolean;
}