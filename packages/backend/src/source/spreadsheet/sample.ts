import { err, ok, Result } from 'backend/core/error/base';

/**
 * テスト用にメンバー一覧データの最初のデータを取得する
 */
export function getSampleData(): Result<any[][]> {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('メンバー一覧');

  if (sheet === null) {
    return err.error('NOT_FOUND_SPREADSHEET')
  }

  const lastCol = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  return ok(sheet.getRange(1, 1, lastRow, lastCol).getValues());
}
