/**
 * シートを取得する
 *
 * 取得しようとしたシートが存在しないときにはエラーを吐く
 */
export function getSheet(sheetName: string) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(sheetName);

  if (sheet === null) {
    throw new Error('NOT_FOUND_SPREADSHEET');
  }

  return sheet;
}

/**
 * シートを削除する
 */
export function deleteSheet(sheetName: string) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet(sheetName);
  book.deleteSheet(sheet);
}
