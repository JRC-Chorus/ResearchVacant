import { fromEntries, toEntries } from 'backend/utils/obj/obj';
import { z } from 'zod';

/**
 * Zodで定義された型定義のオブジェクトにおけるデフォルト値を取得する
 */
export function getDefaults<T extends z.AnyZodObject>(schema: T): z.infer<T> {
  return fromEntries(
    toEntries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, undefined];
    })
  );
}
