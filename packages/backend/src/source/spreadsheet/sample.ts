/**
 * テスト用にメンバー一覧データの最初のデータを取得する
 */
export function getSampleData(): any[][] {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('メンバー一覧');

  if (sheet === null) {
    throw new Error('NOT_FOUND_SPREADSHEET');
  }

  const lastCol = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  return sheet.getRange(1, 1, lastRow, lastCol).getValues();
}
