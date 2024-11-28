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
    return true;
  }
  waitLock(timeoutInMillis: GoogleAppsScript.Integer): void {
    throw new Error('Method not implemented.');
  }
}
