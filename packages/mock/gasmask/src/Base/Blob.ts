export class BlobClass implements GoogleAppsScript.Base.Blob {
  bytesData: GoogleAppsScript.Byte[] = [];
  name: string | null = null;

  copyBlob(): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  getAs(contentType: string): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  getBytes(): GoogleAppsScript.Byte[] {
    return this.bytesData;
  }
  getContentType(): string | null {
    throw new Error('Method not implemented.');
  }
  getDataAsString(charset?: unknown): string {
    return new TextDecoder().decode(new Uint8Array(this.bytesData));
  }
  getName(): string | null {
    return this.name;
  }
  isGoogleType(): boolean {
    throw new Error('Method not implemented.');
  }
  setBytes(data: GoogleAppsScript.Byte[]): GoogleAppsScript.Base.Blob {
    this.bytesData = data;
    return this;
  }
  setContentType(contentType: string | null): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  setContentTypeFromExtension(): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  setDataFromString(
    string: unknown,
    charset?: unknown
  ): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  setName(name: string): GoogleAppsScript.Base.Blob {
    this.name = name;
    return this;
  }
  getAllBlobs(): GoogleAppsScript.Base.Blob[] {
    throw new Error('Method not implemented.');
  }
  getBlob(): GoogleAppsScript.Base.Blob {
    return this
  }
}
