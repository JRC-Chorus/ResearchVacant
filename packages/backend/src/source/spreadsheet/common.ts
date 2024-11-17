/**
 * シートを取得する
 *
 * 取得しようとしたシートが存在しないときにはエラーを吐く
 */
export function getSheet(sheetName: string, createNewSheet: boolean = false) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(sheetName);

  if (sheet === null) {
    if (createNewSheet) {
      sheet = book.insertSheet(sheetName);
    } else {
      throw new Error('NOT_FOUND_SPREADSHEET');
    }
  }

  return sheet;
}

/**
 * シートの更新処理に対してロック管理を付与する
 */
export function warpLock(func: () => void, timeout: number = 10 * 1000) {
  const lock = LockService.getScriptLock()
  if (lock.tryLock(timeout)) {
    // execute update process
    func()

    // release lock
    lock.releaseLock()
  } else {
    throw new Error('CAN NOT UPDATE SHEET (Failed to get LOCK)');
  }
}

/**
 * シートを削除する
 */
export function deleteSheet(sheetName: string) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet(sheetName);
  book.deleteSheet(sheet);
}
