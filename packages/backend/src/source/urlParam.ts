import { UrlParams } from 'backend/schema/app';
import { keys } from 'backend/utils/obj/obj';

/**
 * 取得したパラメータをフロントに渡す形に整形して返す
 *
 * 取得したパラメータが不正の場合は`undefined`を返す
 */
export function getUrlParams(
  params: Record<string, string>
): UrlParams | undefined {
  const requiredKeys = keys(UrlParams.keyof().Values);
  const paramKeys = keys(params);

  // パラメータがすべて存在しているか確認
  if (!requiredKeys.every((k) => paramKeys.includes(k))) {
    return undefined;
  }

  // パースチェック
  const parsed = UrlParams.safeParse(params);
  if (!parsed.success) {
    return undefined;
  }

  return parsed.data;
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test('url checker', () => {
    expect(getUrlParams({ dummy: 'BAD PARAM' })).toBe(undefined);
    expect(getUrlParams({ aId: 'SAMPLE ACCESS CODE' })).toMatchObject({
      aId: 'SAMPLE ACCESS CODE',
    });
  });
}
