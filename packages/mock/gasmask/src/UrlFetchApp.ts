import https from 'https';
import { HttpResponse } from '.';

export class UrlFetchAppClass
  implements GoogleAppsScript.URL_Fetch.UrlFetchApp
{
  fetch(
    url: string,
    params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    // Mockする型定義に合わせるために強引に型変更
    return this._fetch(
      url,
      params
    ) as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
  }
  async _fetch(
    url: string,
    params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ): Promise<GoogleAppsScript.URL_Fetch.HTTPResponse> {
    if (!params) {
      throw new Error('NOT IMPLEMENTED FOR GET ACCESS');
    }

    const sendReqest = (
      resolve: (res: GoogleAppsScript.URL_Fetch.HTTPResponse) => void
    ) => {
      const parsedUrl = new URL(url);
      const payload =
        typeof params.payload === 'string'
          ? params.payload
          : JSON.stringify(params.payload ?? {});

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search, // パスとクエリパラメータを結合
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          resolve(new HttpResponse(responseBody, res.statusCode));
        });
      });

      req.on('error', (e) => {
        throw e;
      });

      req.write(payload);
      req.end();
    };

    return new Promise<GoogleAppsScript.URL_Fetch.HTTPResponse>((resolve) =>
      sendReqest(resolve)
    );
  }

  fetchAll(
    requests: Array<GoogleAppsScript.URL_Fetch.URLFetchRequest | string>
  ): GoogleAppsScript.URL_Fetch.HTTPResponse[] {
    return requests.map((request) => {
      if (typeof request === 'string') {
        return this.fetch(request);
      } else {
        return this.fetch(request.url, request);
      }
    });
  }

  getRequest(
    url: string,
    params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ): GoogleAppsScript.URL_Fetch.URLFetchRequest {
    return {
      method: 'get',
      ...params,
      url,
    };
  }
}
