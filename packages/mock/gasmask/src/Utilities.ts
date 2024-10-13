import { BlobClass } from './Base/Blob';

export class UtilitiesClass implements GoogleAppsScript.Utilities.Utilities {
  Charset!: typeof GoogleAppsScript.Utilities.Charset;
  DigestAlgorithm!: typeof GoogleAppsScript.Utilities.DigestAlgorithm;
  MacAlgorithm!: typeof GoogleAppsScript.Utilities.MacAlgorithm;
  RsaAlgorithm!: typeof GoogleAppsScript.Utilities.RsaAlgorithm;
  base64Decode(encoded: string, charset?: unknown): number[] {
    const decodeStr = atob(encoded);
    return [...Array(decodeStr.length)].map((_, idex) =>
      decodeStr.charCodeAt(idex)
    );
  }
  base64DecodeWebSafe(encoded: unknown, charset?: unknown): number[] {
    throw new Error('Method not implemented.');
  }
  base64Encode(data: string | number[], charset?: unknown): string {
    let byteData: number[];
    if (typeof data === 'string') {
      byteData = this.newBlob(data).getBytes();
    } else {
      byteData = data;
    }
    return Buffer.from(byteData).toString('base64');
  }
  base64EncodeWebSafe(data: unknown, charset?: unknown): string {
    throw new Error('Method not implemented.');
  }
  computeDigest(
    algorithm: unknown,
    value: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  computeHmacSha256Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  computeHmacSignature(
    algorithm: unknown,
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  computeRsaSha1Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  computeRsaSha256Signature(
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  computeRsaSignature(
    algorithm: unknown,
    value: unknown,
    key: unknown,
    charset?: unknown
  ): number[] {
    throw new Error('Method not implemented.');
  }
  formatDate(
    date: GoogleAppsScript.Base.Date,
    timeZone: string,
    format: string
  ): string {
    throw new Error('Method not implemented.');
  }
  formatString(template: string, ...args: any[]): string {
    throw new Error('Method not implemented.');
  }
  getUuid(): string {
    return crypto.randomUUID();
  }
  gzip(blob: unknown, name?: unknown): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  newBlob(
    data: string | number[],
    contentType?: unknown,
    name?: unknown
  ): GoogleAppsScript.Base.Blob {
    if (typeof data === 'string') {
      return new BlobClass().setBytes(
        Object.values(new TextEncoder().encode(data))
      );
    } else {
      return new BlobClass().setBytes(data);
    }
  }
  parseCsv(csv: unknown, delimiter?: unknown): string[][] {
    throw new Error('Method not implemented.');
  }
  parseDate(date: string, timeZone: string, format: string): Date {
    throw new Error('Method not implemented.');
  }
  sleep(milliseconds: GoogleAppsScript.Integer): void {
    throw new Error('Method not implemented.');
  }
  ungzip(blob: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  unzip(blob: GoogleAppsScript.Base.BlobSource): GoogleAppsScript.Base.Blob[] {
    throw new Error('Method not implemented.');
  }
  zip(blobs: unknown, name?: unknown): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  jsonParse(jsonString: string) {
    throw new Error('Method not implemented.');
  }
  jsonStringify(obj: any): string {
    throw new Error('Method not implemented.');
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('base64Test', () => {
    const util = new UtilitiesClass();

    const srcTxt = 'test';
    const encodeTxt = 'dGVzdA==';

    expect(util.base64Encode(srcTxt)).toBe(encodeTxt);

    expect(util.newBlob(util.base64Decode(encodeTxt)).getDataAsString()).toBe(
      srcTxt
    );
  });
}
