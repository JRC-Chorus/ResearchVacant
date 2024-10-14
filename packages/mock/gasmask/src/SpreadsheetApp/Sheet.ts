import { SpreadsheetApp } from '..';
import { RangeClass, type RangeOptions } from './Range';
import { SpreadsheetClass } from './Spreadsheet';

export class SheetClass implements GoogleAppsScript.Spreadsheet.Sheet {
  name: string;
  rows: any[][];
  frozenCols: number | null = null;
  frozenRows: number | null = null;

  constructor(name: string) {
    this.name = name;
    this.rows = [];
  }
  activate(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  addDeveloperMetadata(
    key: unknown,
    value?: unknown,
    visibility?: unknown
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  appendRow(rowContents: any[]): GoogleAppsScript.Spreadsheet.Sheet {
    this.rows.push(rowContents);
    return this;
  }
  asDataSourceSheet(): GoogleAppsScript.Spreadsheet.DataSourceSheet | null {
    throw new Error('Method not implemented.');
  }
  autoResizeColumn(
    columnPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  autoResizeColumns(
    startColumn: GoogleAppsScript.Integer,
    numColumns: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  autoResizeRows(
    startRow: GoogleAppsScript.Integer,
    numRows: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  clear(options?: unknown): GoogleAppsScript.Spreadsheet.Sheet {
    this.rows = [];
    return this;
  }
  clearConditionalFormatRules(): void {
    throw new Error('Method not implemented.');
  }
  clearContents(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  clearFormats(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  clearNotes(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  collapseAllColumnGroups(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  collapseAllRowGroups(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  copyTo(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  createDeveloperMetadataFinder(): GoogleAppsScript.Spreadsheet.DeveloperMetadataFinder {
    throw new Error('Method not implemented.');
  }
  createTextFinder(findText: string): GoogleAppsScript.Spreadsheet.TextFinder {
    throw new Error('Method not implemented.');
  }
  deleteColumn(
    columnPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  deleteColumns(
    columnPosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): void {
    throw new Error('Method not implemented.');
  }
  deleteRow(
    rowPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  deleteRows(
    rowPosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): void {
    throw new Error('Method not implemented.');
  }
  expandAllColumnGroups(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  expandAllRowGroups(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  expandColumnGroupsUpToDepth(
    groupDepth: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  expandRowGroupsUpToDepth(
    groupDepth: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  getActiveCell(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getActiveRange(): GoogleAppsScript.Spreadsheet.Range | null {
    throw new Error('Method not implemented.');
  }
  getActiveRangeList(): GoogleAppsScript.Spreadsheet.RangeList | null {
    throw new Error('Method not implemented.');
  }
  getBandings(): GoogleAppsScript.Spreadsheet.Banding[] {
    throw new Error('Method not implemented.');
  }
  getCharts(): GoogleAppsScript.Spreadsheet.EmbeddedChart[] {
    throw new Error('Method not implemented.');
  }
  getColumnGroup(
    columnIndex: GoogleAppsScript.Integer,
    groupDepth: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Group | null {
    throw new Error('Method not implemented.');
  }
  getColumnGroupControlPosition(): GoogleAppsScript.Spreadsheet.GroupControlTogglePosition {
    throw new Error('Method not implemented.');
  }
  getColumnGroupDepth(
    columnIndex: GoogleAppsScript.Integer
  ): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getColumnWidth(
    columnPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getConditionalFormatRules(): GoogleAppsScript.Spreadsheet.ConditionalFormatRule[] {
    throw new Error('Method not implemented.');
  }
  getCurrentCell(): GoogleAppsScript.Spreadsheet.Range | null {
    throw new Error('Method not implemented.');
  }
  /**
   * @link https://developers.google.com/apps-script/reference/spreadsheet/sheet#getDataRange()
   */
  getDataRange(): GoogleAppsScript.Spreadsheet.Range {
    return this.getRange(1, 1, this.getLastRow(), this.getLastColumn());
  }
  getDataSourceTables(): GoogleAppsScript.Spreadsheet.DataSourceTable[] {
    throw new Error('Method not implemented.');
  }
  getDeveloperMetadata(): GoogleAppsScript.Spreadsheet.DeveloperMetadata[] {
    throw new Error('Method not implemented.');
  }
  getDrawings(): GoogleAppsScript.Spreadsheet.Drawing[] {
    throw new Error('Method not implemented.');
  }
  getFilter(): GoogleAppsScript.Spreadsheet.Filter | null {
    throw new Error('Method not implemented.');
  }
  getFormUrl(): string | null {
    throw new Error('Method not implemented.');
  }
  getFrozenColumns(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getFrozenRows(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getImages(): GoogleAppsScript.Spreadsheet.OverGridImage[] {
    throw new Error('Method not implemented.');
  }
  getIndex(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getLastColumn(): GoogleAppsScript.Integer {
    return this.rows.length ? this.rows[0]?.length : 1;
  }
  getLastRow(): GoogleAppsScript.Integer {
    return this.rows.length;
  }
  getMaxColumns(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getMaxRows(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getName(): string {
    return this.name;
  }
  getNamedRanges(): GoogleAppsScript.Spreadsheet.NamedRange[] {
    throw new Error('Method not implemented.');
  }
  getParent(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    throw new Error('Method not implemented.');
  }
  getPivotTables(): GoogleAppsScript.Spreadsheet.PivotTable[] {
    throw new Error('Method not implemented.');
  }
  getProtections(
    type: GoogleAppsScript.Spreadsheet.ProtectionType
  ): GoogleAppsScript.Spreadsheet.Protection[] {
    throw new Error('Method not implemented.');
  }
  getRange(
    row: unknown,
    col?: unknown,
    numRows?: unknown,
    numColumns?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    if (typeof row === 'string') {
      return new RangeClass(this.rows, { a1: row } as RangeOptions, this);
    }

    return new RangeClass(
      this.rows,
      {
        row,
        col,
        numRows,
        numColumns,
      } as RangeOptions,
      this
    );
  }
  getRangeList(a1Notations: string[]): GoogleAppsScript.Spreadsheet.RangeList {
    throw new Error('Method not implemented.');
  }
  getRowGroup(
    rowIndex: GoogleAppsScript.Integer,
    groupDepth: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Group | null {
    throw new Error('Method not implemented.');
  }
  getRowGroupControlPosition(): GoogleAppsScript.Spreadsheet.GroupControlTogglePosition {
    throw new Error('Method not implemented.');
  }
  getRowGroupDepth(
    rowIndex: GoogleAppsScript.Integer
  ): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getRowHeight(
    rowPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getSelection(): GoogleAppsScript.Spreadsheet.Selection {
    throw new Error('Method not implemented.');
  }
  getSheetId(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getSheetName(): string {
    throw new Error('Method not implemented.');
  }
  getSlicers(): GoogleAppsScript.Spreadsheet.Slicer[] {
    throw new Error('Method not implemented.');
  }
  getTabColor(): string | null {
    throw new Error('Method not implemented.');
  }
  getType(): GoogleAppsScript.Spreadsheet.SheetType {
    throw new Error('Method not implemented.');
  }
  hasHiddenGridlines(): boolean {
    throw new Error('Method not implemented.');
  }
  hideColumn(column: GoogleAppsScript.Spreadsheet.Range): void {
    throw new Error('Method not implemented.');
  }
  hideColumns(columnIndex: unknown, numColumns?: unknown): void {
    throw new Error('Method not implemented.');
  }
  hideRow(row: GoogleAppsScript.Spreadsheet.Range): void {
    throw new Error('Method not implemented.');
  }
  hideRows(rowIndex: unknown, numRows?: unknown): void {
    throw new Error('Method not implemented.');
  }
  hideSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertChart(chart: GoogleAppsScript.Spreadsheet.EmbeddedChart): void {
    throw new Error('Method not implemented.');
  }
  insertColumnAfter(
    afterPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertColumnBefore(
    beforePosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertColumns(columnIndex: unknown, numColumns?: unknown): void {
    throw new Error('Method not implemented.');
  }
  insertColumnsAfter(
    afterPosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertColumnsBefore(
    beforePosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertImage(
    url: unknown,
    column: unknown,
    row: unknown,
    offsetX?: unknown,
    offsetY?: unknown
  ): GoogleAppsScript.Spreadsheet.OverGridImage {
    throw new Error('Method not implemented.');
  }
  insertRowAfter(
    afterPosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertRowBefore(
    beforePosition: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertRows(rowIndex: unknown, numRows?: unknown): void {
    throw new Error('Method not implemented.');
  }
  insertRowsAfter(
    afterPosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertRowsBefore(
    beforePosition: GoogleAppsScript.Integer,
    howMany: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  insertSlicer(
    range: unknown,
    anchorRowPos: unknown,
    anchorColPos: unknown,
    offsetX?: unknown,
    offsetY?: unknown
  ): GoogleAppsScript.Spreadsheet.Slicer {
    throw new Error('Method not implemented.');
  }
  isColumnHiddenByUser(columnPosition: GoogleAppsScript.Integer): boolean {
    throw new Error('Method not implemented.');
  }
  isRightToLeft(): boolean {
    throw new Error('Method not implemented.');
  }
  isRowHiddenByFilter(rowPosition: GoogleAppsScript.Integer): boolean {
    throw new Error('Method not implemented.');
  }
  isRowHiddenByUser(rowPosition: GoogleAppsScript.Integer): boolean {
    throw new Error('Method not implemented.');
  }
  isSheetHidden(): boolean {
    throw new Error('Method not implemented.');
  }
  moveColumns(
    columnSpec: GoogleAppsScript.Spreadsheet.Range,
    destinationIndex: GoogleAppsScript.Integer
  ): void {
    throw new Error('Method not implemented.');
  }
  moveRows(
    rowSpec: GoogleAppsScript.Spreadsheet.Range,
    destinationIndex: GoogleAppsScript.Integer
  ): void {
    throw new Error('Method not implemented.');
  }
  newChart(): GoogleAppsScript.Spreadsheet.EmbeddedChartBuilder {
    throw new Error('Method not implemented.');
  }
  protect(): GoogleAppsScript.Spreadsheet.Protection {
    throw new Error('Method not implemented.');
  }
  removeChart(chart: GoogleAppsScript.Spreadsheet.EmbeddedChart): void {
    throw new Error('Method not implemented.');
  }
  setActiveRange(
    range: GoogleAppsScript.Spreadsheet.Range
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setActiveRangeList(
    rangeList: GoogleAppsScript.Spreadsheet.RangeList
  ): GoogleAppsScript.Spreadsheet.RangeList {
    throw new Error('Method not implemented.');
  }
  setActiveSelection(a1Notation: unknown): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setColumnGroupControlPosition(
    position: GoogleAppsScript.Spreadsheet.GroupControlTogglePosition
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setColumnWidth(
    columnPosition: GoogleAppsScript.Integer,
    width: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setColumnWidths(
    startColumn: GoogleAppsScript.Integer,
    numColumns: GoogleAppsScript.Integer,
    width: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setConditionalFormatRules(
    rules: GoogleAppsScript.Spreadsheet.ConditionalFormatRule[]
  ): void {
    throw new Error('Method not implemented.');
  }
  setCurrentCell(
    cell: GoogleAppsScript.Spreadsheet.Range
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setHiddenGridlines(
    hideGridlines: boolean
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setName(name: string): GoogleAppsScript.Spreadsheet.Sheet {
    this.name = name;
    return this;
  }
  setRightToLeft(rightToLeft: boolean): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setRowGroupControlPosition(
    position: GoogleAppsScript.Spreadsheet.GroupControlTogglePosition
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setRowHeight(
    rowPosition: GoogleAppsScript.Integer,
    height: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setRowHeights(
    startRow: GoogleAppsScript.Integer,
    numRows: GoogleAppsScript.Integer,
    height: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setRowHeightsForced(
    startRow: GoogleAppsScript.Integer,
    numRows: GoogleAppsScript.Integer,
    height: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setTabColor(color: string | null): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  showColumns(columnIndex: unknown, numColumns?: unknown): void {
    throw new Error('Method not implemented.');
  }
  showRows(rowIndex: unknown, numRows?: unknown): void {
    throw new Error('Method not implemented.');
  }
  showSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  sort(
    columnPosition: unknown,
    ascending?: unknown
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  unhideColumn(column: GoogleAppsScript.Spreadsheet.Range): void {
    throw new Error('Method not implemented.');
  }
  unhideRow(row: GoogleAppsScript.Spreadsheet.Range): void {
    throw new Error('Method not implemented.');
  }
  updateChart(chart: GoogleAppsScript.Spreadsheet.EmbeddedChart): void {
    throw new Error('Method not implemented.');
  }
  getSheetProtection(): GoogleAppsScript.Spreadsheet.PageProtection {
    throw new Error('Method not implemented.');
  }
  setSheetProtection(
    permissions: GoogleAppsScript.Spreadsheet.PageProtection
  ): void {
    throw new Error('Method not implemented.');
  }

  getSheetValues(
    startRow: number,
    startColumn: number,
    numRows: number,
    numColumns: number
  ) {
    return this.getRange(
      startRow,
      startColumn,
      numRows,
      numColumns
    ).getValues();
  }

  setFrozenColumns(cols: number) {
    this.frozenCols = cols;
  }
  setFrozenRows(rows: number) {
    this.frozenRows = rows;
  }
}

/** In Source Testing */
if (import.meta.vitest) {
  const { expect, beforeEach, describe, it } = import.meta.vitest;

  let sheet = new SheetClass('TestSheet');
  const sheetData = [
    ['Date', 'Amount', 'Name', 'Category'],
    ['2021-01-01', 5.32, 'Kwickiemart', 'Shops'],
    ['2021-01-02', 72.48, 'Shopmart', 'Shops'],
    ['2021-01-03', 1.97, 'Kwickiemart', 'Shops'],
    ['2021-01-03', 43.87, 'Gasmart', 'Gas'],
    ['2021-01-04', 824.93, 'Wholepaycheck', 'Groceries'],
  ];

  beforeEach(() => {
    sheet = new SheetClass('TestSheet');
    sheetData.forEach((row) => sheet.appendRow(row));
  });

  describe('Sheet', () => {
    it('should return a Spreadsheet instance when calling getActiveSpreadsheet()', () => {
      const ss = new SpreadsheetApp();
      expect(ss.getActiveSpreadsheet()).toBeInstanceOf(SpreadsheetClass);
    });

    describe('getLastRow', () => {
      it('should return accurate 1-based counted last row', () => {
        expect(sheet.getLastRow()).toBe(sheetData.length);
      });
    });

    describe('getLastColumn', () => {
      it('should return accurate 1-based counted last column', () => {
        expect(sheet.getLastColumn()).toBe(sheetData[0].length);
      });
    });

    describe('getDataRange', () => {
      it('should return full data range of the current spreadsheet', () => {
        expect(sheet.getDataRange().getValues()).toEqual(sheetData);
      });
    });

    describe('getRange', () => {
      it('getRange with row and col should return a range with a single cell', () => {
        const range = sheet.getRange(1, 1);

        expect(range.getValues()).toEqual([['Date']]);
      });

      it('getRange with row, col, and numRows', () => {
        const range = sheet.getRange(1, 2, 2);

        expect(range.getValues()).toEqual([['Amount'], [5.32]]);
      });

      it('getRange with row, col, numRows, and numColumns', () => {
        const range = sheet.getRange(
          1,
          1,
          sheet.getLastRow(),
          sheet.getLastColumn()
        );

        expect(range.getValues()).toEqual(sheetData);
      });

      it('getRange with A1 for single cell', () => {
        const range = sheet.getRange('A1');

        expect(range.getValues()).toEqual([['Date']]);
      });

      it('getRange with A1 for single row', () => {
        const range = sheet.getRange('A1:D1');

        expect(range.getValues()).toEqual([
          ['Date', 'Amount', 'Name', 'Category'],
        ]);
      });

      it('getRange with A1 for multiple rows', () => {
        const range = sheet.getRange('A1:D6');

        expect(range.getValues()).toEqual(sheetData);
      });

      it('getRange returns range that updates values back to sheet', () => {
        const range = sheet.getRange('A2:D2');

        expect(range.getValues()).toEqual([
          ['2021-01-01', 5.32, 'Kwickiemart', 'Shops'],
        ]);

        // Update values and re-select new range from sheet
        range.setValues([['2021-01-01', '6.32', 'Kwickiemart', 'Shops Also']]);

        const newRange = sheet.getRange('A2:D2');
        expect(newRange.getValues()).toEqual([
          ['2021-01-01', '6.32', 'Kwickiemart', 'Shops Also'],
        ]);
      });
    });
  });
}
