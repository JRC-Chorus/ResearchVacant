import type StringDict from './types/StringDict';

export class HttpResponseClass
  implements GoogleAppsScript.URL_Fetch.HTTPResponse
{
  protected statusCode?: number;
  protected message: string;

  constructor(message: string, statusCode?: number) {
    this.statusCode = statusCode;
    this.message = message;
  }

  getAs(contentType: string): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  getBlob(): GoogleAppsScript.Base.Blob {
    throw new Error('Method not implemented.');
  }
  getContent(): GoogleAppsScript.Byte[] {
    throw new Error('Method not implemented.');
  }
  getContentText(charset?: string): string {
    return this.message;
  }
  getHeaders(): object {
    throw new Error('Method not implemented.');
  }
  getResponseCode(): GoogleAppsScript.Integer {
    return this.statusCode ?? 0;
  }
  getAllHeaders(): StringDict {
    return {};
  }
}
