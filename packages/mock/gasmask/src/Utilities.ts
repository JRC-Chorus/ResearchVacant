import CryptoJS from 'crypto-js';
import { BlobClass } from './Base/Blob';

export class UtilitiesClass implements GoogleAppsScript.Utilities.Utilities {
  Charset!: typeof GoogleAppsScript.Utilities.Charset;
  DigestAlgorithm = {
    MD2: 0,
    MD5: 1,
    SHA_1: 2,
    SHA_256: 3,
    SHA_384: 4,
    SHA_512: 5,
  };
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
    return Buffer.from(this.newBlob(data).getBytes()).toString('base64');
  }
  base64EncodeWebSafe(data: unknown, charset?: unknown): string {
    throw new Error('Method not implemented.');
  }
  computeDigest(
    algorithm: GoogleAppsScript.Utilities.DigestAlgorithm,
    value: string | GoogleAppsScript.Byte[],
    charset?: GoogleAppsScript.Utilities.Charset
  ): GoogleAppsScript.Byte[] {
    // 文字列化
    const targetTxt = this.newBlob(value).getDataAsString();
    let returnTxt: string;

    switch (algorithm) {
      case this.DigestAlgorithm.MD2:
        throw new Error('Method not implemented.');
      case this.DigestAlgorithm.MD5:
        returnTxt = CryptoJS.MD5(targetTxt).toString();
        break
      case this.DigestAlgorithm.SHA_1:
        returnTxt = CryptoJS.SHA1(targetTxt).toString();
        break
      case this.DigestAlgorithm.SHA_256:
        returnTxt = CryptoJS.SHA256(targetTxt).toString();
        break
      case this.DigestAlgorithm.SHA_384:
        returnTxt = CryptoJS.SHA384(targetTxt).toString();
        break
      case this.DigestAlgorithm.SHA_512:
        returnTxt = CryptoJS.SHA512(targetTxt).toString();
        break
      default:
        throw new Error('Method not implemented.');
    }

    return this.newBlob(returnTxt).getBytes();
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

  test('hash', () => {
    const util = new UtilitiesClass();

    const srcTxt = 'test';
    const sha256Txt =
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

    expect(util.computeDigest(util.DigestAlgorithm.SHA_256, srcTxt)).toEqual(
      util.newBlob(sha256Txt).getBytes()
    );
  });
}
