import HttpResponse from './HttpResponse';
import type HttpRequest from './types/HttpRequest';
import type StringDict from './types/StringDict';

export default class UrlFetchApp {
  static fetch(
    url: string,
    params: StringDict | HttpRequest = {}
  ): HttpResponse {
    throw new Error(
      'Fetch not implemented. Mock/stub this with jest.spyOn(), sinon.stub(), or similar.'
    );
  }

  static fetchAll(requests: HttpRequest[]) {
    return requests.map((request) => {
      const { url, ...params } = request;

      return UrlFetchApp.fetch(url, request);
    });
  }

  static getRequest(url: string, params: StringDict = {}): HttpRequest {
    return {
      method: 'get',
      ...params,
      url,
    };
  }
}
