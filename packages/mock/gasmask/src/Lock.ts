export class LockServiceClass implements GoogleAppsScript.Lock.LockService {
  protected scriptLock = new Lock();

  /**
   * 同一のドキュメントからの同時実行はできない
   * （別のドキュメントからであれば同じスクリプトを実行できる）
   */
  getDocumentLock(): GoogleAppsScript.Lock.Lock {
    throw new Error('Method not implemented.');
  }
  /**
   * どのような実行環境であっても同じプログラムを実行することはできない
   */
  getScriptLock(): GoogleAppsScript.Lock.Lock {
    return this.scriptLock;
  }
  /**
   * 同一のユーザーから同じプログラムを実行することはできない
   * （別のユーザーからのアクセスであれば実行できる）
   */
  getUserLock(): GoogleAppsScript.Lock.Lock {
    throw new Error('Method not implemented.');
  }
}

class Lock implements GoogleAppsScript.Lock.Lock {
  protected isLock: boolean = false;

  hasLock(): boolean {
    return this.isLock;
  }
  releaseLock(): void {
    this.isLock = false;
  }
  tryLock(timeoutInMillis: GoogleAppsScript.Integer): boolean {
    let isSuccess = false;
    const interValId = setInterval(() => {
      if (!this.isLock) {
        this.isLock = true;
        isSuccess = true;
        clearInterval(interValId);
      }
    }, 100);

    setTimeout(() => clearInterval(interValId), timeoutInMillis);
    return isSuccess;
  }
  waitLock(timeoutInMillis: GoogleAppsScript.Integer): void {
    const isSuccess = this.tryLock(timeoutInMillis);
    if (!isSuccess) {
      throw new Error('Failed to get a lock');
    }
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  global.LockService = new LockServiceClass();

  let baseData = '';

  /**
   *  データベースを更新するサンプル関数
   * （更新に５秒かかる想定）
   */
  function dummySetDataFunc(setVal: string) {
    return new Promise<void>((resolve) => {
      let tmpData = baseData;
      setTimeout(() => {
        tmpData += ` ${setVal}`;
        baseData = tmpData;
        resolve();
      }, 5000);
    });
  }

  test.skip('no lock', async () => {
    // 条件を揃えるために元データをリセット
    baseData = 'FIRST DATA';

    // データを複数回更新（同時アクセスのサンプル）
    await Promise.all([
      dummySetDataFunc('MIDDLE DATA'),
      dummySetDataFunc('FINAL DATA'),
    ]);

    // middle dataが先祖返りしている
    expect(baseData).toBe(['FIRST DATA', 'FINAL DATA'].join(' '));
  });

  test('use lock', async () => {
    // 条件を揃えるために元データをリセット
    baseData = 'FIRST DATA';

    // lockを使って処理を実行
    const warpLock = async (func: () => Promise<void>) => {
      const lock = LockService.getScriptLock();
      if (lock.tryLock(10 * 1000)) {
        await func();
      }
      lock.releaseLock();
    };

    // データを複数回更新（同時アクセスのサンプル）
    await Promise.all([
      warpLock(() => dummySetDataFunc('MIDDLE DATA')),
      warpLock(() => dummySetDataFunc('FINAL DATA')),
    ]);

    // middle dataを含めてすべてのデータが格納されている
    expect(baseData).toBe(
      ['FIRST DATA', 'MIDDLE DATA', 'FINAL DATA'].join(' ')
    );
  });
}
