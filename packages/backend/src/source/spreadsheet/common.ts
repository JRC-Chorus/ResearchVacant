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
 * シートを削除する
 */
export function deleteSheet(sheetName: string) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet(sheetName);
  book.deleteSheet(sheet);
}
