import { SheetClass } from './Sheet';

export interface RangeOptions {
  a1?: string;
  row?: number;
  col?: number;
  numRows?: number;
  numColumns?: number;
}
export interface RangeComputed {
  row: number;
  col: number;
  numRows: number;
  numColumns: number;
}

export class RangeClass implements GoogleAppsScript.Spreadsheet.Range {
  __sheet: SheetClass;
  criteria: RangeOptions;
  value: any | undefined;
  values: any[] = [];
  rangeValues: any[] = [];
  rangeComputed: RangeComputed;

  constructor(values: any[], criteria: RangeOptions, __sheet: SheetClass) {
    this.__sheet = __sheet;
    this.values = values;
    this.criteria = criteria;

    if (criteria.a1) {
      [this.rangeValues, this.rangeComputed] = getValuesFromA1Notation(
        this.values,
        criteria.a1
      );
      return;
    } else {
      this.rangeComputed = {
        row: criteria.row ? criteria.row - 1 : 0,
        col: criteria.col ? criteria.col - 1 : 0,
        numRows: criteria.numRows || 1,
        numColumns: criteria.numColumns || 1,
      };
    }
    this.rangeValues = getValuesWithCriteria(this.values, this.rangeComputed);
  }
  activate(): GoogleAppsScript.Spreadsheet.Range {
    return this;
  }
  activateAsCurrentCell(): GoogleAppsScript.Spreadsheet.Range {
    return this;
  }
  addDeveloperMetadata(
    key: unknown,
    value?: unknown,
    visibility?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  applyColumnBanding(
    bandingTheme?: unknown,
    showHeader?: unknown,
    showFooter?: unknown
  ): GoogleAppsScript.Spreadsheet.Banding {
    throw new Error('Method not implemented.');
  }
  applyRowBanding(
    bandingTheme?: unknown,
    showHeader?: unknown,
    showFooter?: unknown
  ): GoogleAppsScript.Spreadsheet.Banding {
    throw new Error('Method not implemented.');
  }
  autoFill(
    destination: GoogleAppsScript.Spreadsheet.Range,
    series: GoogleAppsScript.Spreadsheet.AutoFillSeries
  ): void {
    throw new Error('Method not implemented.');
  }
  autoFillToNeighbor(
    series: GoogleAppsScript.Spreadsheet.AutoFillSeries
  ): void {
    throw new Error('Method not implemented.');
  }
  breakApart(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  canEdit(): boolean {
    throw new Error('Method not implemented.');
  }
  check(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  clear(options?: unknown): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  clearContent(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  clearDataValidations(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  clearFormat(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  clearNote(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  collapseGroups(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  copyFormatToRange(
    sheet: unknown,
    column: unknown,
    columnEnd: unknown,
    row: unknown,
    rowEnd: unknown
  ): void {
    throw new Error('Method not implemented.');
  }
  copyTo(
    destination: unknown,
    copyPasteType?: unknown,
    transposed?: unknown
  ): void {
    throw new Error('Method not implemented.');
  }
  copyValuesToRange(
    sheet: unknown,
    column: unknown,
    columnEnd: unknown,
    row: unknown,
    rowEnd: unknown
  ): void {
    throw new Error('Method not implemented.');
  }
  createDataSourcePivotTable(
    dataSource: GoogleAppsScript.Spreadsheet.DataSource
  ): GoogleAppsScript.Spreadsheet.DataSourcePivotTable {
    throw new Error('Method not implemented.');
  }
  createDataSourceTable(
    dataSource: GoogleAppsScript.Spreadsheet.DataSource
  ): GoogleAppsScript.Spreadsheet.DataSourceTable {
    throw new Error('Method not implemented.');
  }
  createDeveloperMetadataFinder(): GoogleAppsScript.Spreadsheet.DeveloperMetadataFinder {
    throw new Error('Method not implemented.');
  }
  createFilter(): GoogleAppsScript.Spreadsheet.Filter {
    throw new Error('Method not implemented.');
  }
  createPivotTable(
    sourceData: GoogleAppsScript.Spreadsheet.Range
  ): GoogleAppsScript.Spreadsheet.PivotTable {
    throw new Error('Method not implemented.');
  }
  createTextFinder(findText: string): GoogleAppsScript.Spreadsheet.TextFinder {
    throw new Error('Method not implemented.');
  }
  deleteCells(shiftDimension: GoogleAppsScript.Spreadsheet.Dimension): void {
    throw new Error('Method not implemented.');
  }
  expandGroups(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getA1Notation(): string {
    throw new Error('Method not implemented.');
  }
  getBackground(): string {
    throw new Error('Method not implemented.');
  }
  getBackgroundObject(): GoogleAppsScript.Spreadsheet.Color {
    throw new Error('Method not implemented.');
  }
  getBackgroundObjects(): GoogleAppsScript.Spreadsheet.Color[][] {
    throw new Error('Method not implemented.');
  }
  getBackgrounds(): string[][] {
    throw new Error('Method not implemented.');
  }
  getBandings(): GoogleAppsScript.Spreadsheet.Banding[] {
    throw new Error('Method not implemented.');
  }
  getCell(
    row: GoogleAppsScript.Integer,
    column: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getColumn(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getDataRegion(dimension?: unknown): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getDataSourceFormula(): GoogleAppsScript.Spreadsheet.DataSourceFormula {
    throw new Error('Method not implemented.');
  }
  getDataSourceFormulas(): GoogleAppsScript.Spreadsheet.DataSourceFormula[] {
    throw new Error('Method not implemented.');
  }
  getDataSourcePivotTables(): GoogleAppsScript.Spreadsheet.DataSourcePivotTable[] {
    throw new Error('Method not implemented.');
  }
  getDataSourceTables(): GoogleAppsScript.Spreadsheet.DataSourceTable[] {
    throw new Error('Method not implemented.');
  }
  getDataSourceUrl(): string {
    throw new Error('Method not implemented.');
  }
  getDataTable(firstRowIsHeader?: unknown): GoogleAppsScript.Charts.DataTable {
    throw new Error('Method not implemented.');
  }
  getDataValidation(): GoogleAppsScript.Spreadsheet.DataValidation | null {
    throw new Error('Method not implemented.');
  }
  getDataValidations(): Array<
    Array<GoogleAppsScript.Spreadsheet.DataValidation | null>
  > {
    throw new Error('Method not implemented.');
  }
  getDeveloperMetadata(): GoogleAppsScript.Spreadsheet.DeveloperMetadata[] {
    throw new Error('Method not implemented.');
  }
  getDisplayValue(): string {
    throw new Error('Method not implemented.');
  }
  getDisplayValues(): string[][] {
    throw new Error('Method not implemented.');
  }
  getFilter(): GoogleAppsScript.Spreadsheet.Filter | null {
    throw new Error('Method not implemented.');
  }
  getFontColor(): string {
    throw new Error('Method not implemented.');
  }
  getFontColors(): string[][] {
    throw new Error('Method not implemented.');
  }
  getFontColorObject(): GoogleAppsScript.Spreadsheet.Color {
    throw new Error('Method not implemented.');
  }
  getFontColorObjects(): GoogleAppsScript.Spreadsheet.Color[][] {
    throw new Error('Method not implemented.');
  }
  getFontFamilies(): string[][] {
    throw new Error('Method not implemented.');
  }
  getFontFamily(): string {
    throw new Error('Method not implemented.');
  }
  getFontLine(): GoogleAppsScript.Spreadsheet.FontLine {
    throw new Error('Method not implemented.');
  }
  getFontLines(): GoogleAppsScript.Spreadsheet.FontLine[][] {
    throw new Error('Method not implemented.');
  }
  getFontSize(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getFontSizes(): GoogleAppsScript.Integer[][] {
    throw new Error('Method not implemented.');
  }
  getFontStyle(): GoogleAppsScript.Spreadsheet.FontStyle {
    throw new Error('Method not implemented.');
  }
  getFontStyles(): GoogleAppsScript.Spreadsheet.FontStyle[][] {
    throw new Error('Method not implemented.');
  }
  getFontWeight(): GoogleAppsScript.Spreadsheet.FontWeight {
    throw new Error('Method not implemented.');
  }
  getFontWeights(): GoogleAppsScript.Spreadsheet.FontWeight[][] {
    throw new Error('Method not implemented.');
  }
  getFormula(): string {
    throw new Error('Method not implemented.');
  }
  getFormulaR1C1(): string | null {
    throw new Error('Method not implemented.');
  }
  getFormulas(): string[][] {
    throw new Error('Method not implemented.');
  }
  getFormulasR1C1(): Array<Array<string | null>> {
    throw new Error('Method not implemented.');
  }
  getGridId(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getHeight(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getHorizontalAlignment(): string {
    throw new Error('Method not implemented.');
  }
  getHorizontalAlignments(): string[][] {
    throw new Error('Method not implemented.');
  }
  getLastColumn(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getLastRow(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getMergedRanges(): GoogleAppsScript.Spreadsheet.Range[] {
    throw new Error('Method not implemented.');
  }
  getNextDataCell(
    direction: GoogleAppsScript.Spreadsheet.Direction
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getNote(): string {
    throw new Error('Method not implemented.');
  }
  getNotes(): string[][] {
    throw new Error('Method not implemented.');
  }
  getNumColumns(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getNumRows(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getNumberFormat(): string {
    throw new Error('Method not implemented.');
  }
  getNumberFormats(): string[][] {
    throw new Error('Method not implemented.');
  }
  getRichTextValue(): GoogleAppsScript.Spreadsheet.RichTextValue | null {
    throw new Error('Method not implemented.');
  }
  getRichTextValues(): Array<
    Array<GoogleAppsScript.Spreadsheet.RichTextValue | null>
  > {
    throw new Error('Method not implemented.');
  }
  getRow(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getRowIndex(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  getTextDirection(): GoogleAppsScript.Spreadsheet.TextDirection | null {
    throw new Error('Method not implemented.');
  }
  getTextDirections(): Array<
    Array<GoogleAppsScript.Spreadsheet.TextDirection | null>
  > {
    throw new Error('Method not implemented.');
  }
  getTextRotation(): GoogleAppsScript.Spreadsheet.TextRotation {
    throw new Error('Method not implemented.');
  }
  getTextRotations(): GoogleAppsScript.Spreadsheet.TextRotation[][] {
    throw new Error('Method not implemented.');
  }
  getTextStyle(): GoogleAppsScript.Spreadsheet.TextStyle {
    throw new Error('Method not implemented.');
  }
  getTextStyles(): GoogleAppsScript.Spreadsheet.TextStyle[][] {
    throw new Error('Method not implemented.');
  }
  getVerticalAlignment(): string {
    throw new Error('Method not implemented.');
  }
  getVerticalAlignments(): string[][] {
    throw new Error('Method not implemented.');
  }
  getWidth(): GoogleAppsScript.Integer {
    throw new Error('Method not implemented.');
  }
  getWrap(): boolean {
    throw new Error('Method not implemented.');
  }
  getWrapStrategies(): GoogleAppsScript.Spreadsheet.WrapStrategy[][] {
    throw new Error('Method not implemented.');
  }
  getWrapStrategy(): GoogleAppsScript.Spreadsheet.WrapStrategy {
    throw new Error('Method not implemented.');
  }
  getWraps(): boolean[][] {
    throw new Error('Method not implemented.');
  }
  insertCells(
    shiftDimension: GoogleAppsScript.Spreadsheet.Dimension
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  insertCheckboxes(
    checkedValue?: unknown,
    uncheckedValue?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  isBlank(): boolean {
    throw new Error('Method not implemented.');
  }
  isChecked(): boolean | null {
    throw new Error('Method not implemented.');
  }
  isEndColumnBounded(): boolean {
    throw new Error('Method not implemented.');
  }
  isEndRowBounded(): boolean {
    throw new Error('Method not implemented.');
  }
  isPartOfMerge(): boolean {
    throw new Error('Method not implemented.');
  }
  isStartColumnBounded(): boolean {
    throw new Error('Method not implemented.');
  }
  isStartRowBounded(): boolean {
    throw new Error('Method not implemented.');
  }
  merge(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  mergeAcross(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  mergeVertically(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  moveTo(target: GoogleAppsScript.Spreadsheet.Range): void {
    throw new Error('Method not implemented.');
  }
  offset(
    rowOffset: unknown,
    columnOffset: unknown,
    numRows?: unknown,
    numColumns?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  protect(): GoogleAppsScript.Spreadsheet.Protection {
    throw new Error('Method not implemented.');
  }
  randomize(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  removeCheckboxes(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  removeDuplicates(
    columnsToCompare?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBackground(color: string | null): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBackgroundObject(
    color: GoogleAppsScript.Spreadsheet.Color | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBackgroundObjects(
    color: GoogleAppsScript.Spreadsheet.Color[][] | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBackgroundRGB(
    red: GoogleAppsScript.Integer,
    green: GoogleAppsScript.Integer,
    blue: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBackgrounds(
    color: Array<Array<string | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setBorder(
    top: unknown,
    left: unknown,
    bottom: unknown,
    right: unknown,
    vertical: unknown,
    horizontal: unknown,
    color?: unknown,
    style?: unknown
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setDataValidation(
    rule: GoogleAppsScript.Spreadsheet.DataValidation | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setDataValidations(
    rules: Array<Array<GoogleAppsScript.Spreadsheet.DataValidation | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontColor(color: string | null): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontColorObject(
    color: GoogleAppsScript.Spreadsheet.Color | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontColorObjects(
    colors: Array<Array<GoogleAppsScript.Spreadsheet.Color | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontColors(colors: any[][]): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontFamilies(
    fontFamilies: Array<Array<string | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontFamily(fontFamily: string | null): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontLine(
    fontLine: GoogleAppsScript.Spreadsheet.FontLine | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontLines(
    fontLines: Array<Array<GoogleAppsScript.Spreadsheet.FontLine | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontSize(
    size: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontSizes(
    sizes: GoogleAppsScript.Integer[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontStyle(
    fontStyle: GoogleAppsScript.Spreadsheet.FontStyle | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontStyles(
    fontStyles: Array<Array<GoogleAppsScript.Spreadsheet.FontStyle | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontWeight(
    fontWeight: GoogleAppsScript.Spreadsheet.FontWeight | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFontWeights(
    fontWeights: Array<Array<GoogleAppsScript.Spreadsheet.FontWeight | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFormula(formula: string): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFormulaR1C1(formula: string): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFormulas(formulas: string[][]): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setFormulasR1C1(formulas: string[][]): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setHorizontalAlignment(
    alignment: 'left' | 'center' | 'normal' | 'right' | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setHorizontalAlignments(
    alignments: Array<Array<'left' | 'center' | 'normal' | 'right' | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setNote(note: string | null): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setNotes(
    notes: Array<Array<string | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setNumberFormat(numberFormat: string): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setNumberFormats(
    numberFormats: string[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setRichTextValue(
    value: GoogleAppsScript.Spreadsheet.RichTextValue
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setRichTextValues(
    values: GoogleAppsScript.Spreadsheet.RichTextValue[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setShowHyperlink(showHyperlink: boolean): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextDirection(
    direction: GoogleAppsScript.Spreadsheet.TextDirection | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextDirections(
    directions: Array<Array<GoogleAppsScript.Spreadsheet.TextDirection | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextRotation(rotation: unknown): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextRotations(
    rotations: GoogleAppsScript.Spreadsheet.TextRotation[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextStyle(
    style: GoogleAppsScript.Spreadsheet.TextStyle
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setTextStyles(
    styles: GoogleAppsScript.Spreadsheet.TextStyle[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setValue(value: any): GoogleAppsScript.Spreadsheet.Range {
    this.value = value;

    // Update Sheet
    if (this.__sheet) {
      if (this.criteria.a1) {
        const firstCell = this.criteria.a1.split(':')[0];
        const [row, column] = cellToRoWCol(firstCell);
        this.__sheet.rows[row][column] = value;
      } else {
        const rc = this.rangeComputed;
        this.__sheet.rows[rc.row][rc.col] = value;
      }
    }

    return this;
  }
  setValues(values: any[][]): GoogleAppsScript.Spreadsheet.Range {
    this.values = values;
    const rc = this.rangeComputed;
    const currentValues = getValuesWithCriteria(
      this.values,
      this.rangeComputed
    );

    // Update Sheet
    if (this.__sheet && values) {
      for (let row = 0; row < values.length; row++) {
        const rowValues = this.__sheet.rows[rc.row + row];
        const newValues = values[row];

        // Range length check... (GAS does this too)
        if (rowValues && newValues && rowValues.length !== newValues.length) {
          throw new Error(
            `The number of columns in the data does not match the number of columns in the range. The data has ${newValues.length} but the range has ${rowValues.length}.`
          );
        }

        this.__sheet.rows[rc.row + row] = newValues;
      }
      this.rangeValues = getValuesWithCriteria(this.values, this.rangeComputed);
    }

    return this;
  }
  setVerticalAlignment(
    alignment: 'top' | 'middle' | 'bottom' | null
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setVerticalAlignments(
    alignments: Array<Array<'top' | 'middle' | 'bottom' | null>>
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setVerticalText(isVertical: boolean): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setWrap(isWrapEnabled: boolean): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setWrapStrategies(
    strategies: GoogleAppsScript.Spreadsheet.WrapStrategy[][]
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setWrapStrategy(
    strategy: GoogleAppsScript.Spreadsheet.WrapStrategy
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  setWraps(isWrapEnabled: boolean[][]): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  shiftColumnGroupDepth(
    delta: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  shiftRowGroupDepth(
    delta: GoogleAppsScript.Integer
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  sort(sortSpecObj: any): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  splitTextToColumns(delimiter?: unknown): void {
    throw new Error('Method not implemented.');
  }
  trimWhitespace(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  uncheck(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }

  getValue() {
    if (this.__sheet) {
      if (this.criteria.a1) {
        return this.rangeValues[0][0];
      } else {
        const rc = this.rangeComputed;
        return this.__sheet.rows[rc.row][rc.col];
      }
    }

    return this.value;
  }

  getValues() {
    return this.rangeValues;
  }
}

/**
 * The "meat" of the Range slicing...
 */
function getValuesWithCriteria(values: any[], c: RangeComputed): any[] {
  const rows = values.slice(c.row, c.row + c.numRows);
  const result = rows.map((row) => row.slice(c.col, c.col + c.numColumns));

  return result;
}

function letterToColumn(letter: string) {
  let column = 0;
  const length = letter.length;

  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }

  return column;
}

/**
 * @link https://stackoverflow.com/a/58545538
 */
function getValuesFromA1Notation(
  values: any[][],
  textRange: string
): [any[][], RangeComputed] {
  let startRow: number, startCol: number, endRow: number, endCol: number;
  const range = textRange.split(':');
  let ret = cellToRoWCol(range[0]);
  startRow = ret[0];
  startCol = ret[1];
  if (startRow == -1) {
    startRow = 0;
  }
  if (startCol == -1) {
    startCol = 0;
  }

  if (range[1]) {
    ret = cellToRoWCol(range[1]);
    endRow = ret[0];
    endCol = ret[1];
    if (endRow == -1) {
      endRow = values.length;
    }
    if (endCol == -1) {
      endCol = values.length;
    }
  } else {
    // only one cell
    endRow = startRow;
    endCol = startCol;
  }

  // Not enough rows in our data?
  if (values.length < endRow + 1) {
    values = new Array(endRow + 1 - startRow)
      .fill([])
      .map((emptyValue, index) => {
        return values[index] || emptyValue;
      });
  }

  return [
    values.slice(startRow, endRow + 1).map(function (i: any[]) {
      if (i.length < endCol + 1) {
        const numCols = endCol + 1 - startCol;
        // Not enough cols in our data?
        i = new Array(numCols <= 0 ? endCol : numCols)
          .fill('')
          .map((emptyValue, index) => {
            return i[index] || emptyValue;
          });
      }
      return i.slice(startCol, endCol + 1);
    }),
    {
      row: startRow,
      col: startCol,
      numRows: endRow - startRow + 1,
      numColumns: endCol - startCol + 1,
    },
  ];
}

function cellToRoWCol(cell: string): [number, number] {
  // returns row & col from A1 notation
  let row = Number(cell.replace(/[^0-9]+/g, ''));
  const letter = cell.replace(/[^a-zA-Z]+/g, '').toUpperCase();
  let column = letterToColumn(letter);

  row = row - 1;
  column--;

  return [row, column];
}

/** In Source Testing */
if (import.meta.vitest) {
  const { expect, it, beforeEach, describe } = import.meta.vitest;
  let sheet = new SheetClass('TestSheet');
  const sheetData = [
    ['Date', 'Amount', 'Name', 'Category'],
    ['2021-01-01', 1, 'Kwickiemart', 'Shops'],
    ['2021-01-02', 1, 'Shopmart', 'Shops'],
    ['2021-01-03', 1, 'Kwickiemart', 'Shops'],
    ['2021-01-03', 1, 'Gasmart', 'Gas'],
    ['2021-01-04', 1, 'Wholepaycheck', 'Groceries'],
  ];

  beforeEach(() => {
    sheet = new SheetClass('TestSheet');
    sheetData.forEach((row) => sheet.appendRow(row));
  });

  describe('Range', () => {
    describe('getValues', () => {
      it('should return full column of values in a1 notation', () => {
        const values = sheet.getRange('B2:B').getValues();
        const sum = values.reduce((prev, amount) => prev + amount[0], 0);

        expect(values).toEqual([[1], [1], [1], [1], [1]]);
        expect(sum).toEqual(5);
      });

      it('should fill in values in rows with blanks when range is larger than values', () => {
        const values = sheet.getRange('A1:J1').getValues();

        expect(values[0].length).toEqual(10);
      });

      it('should fill in values in columns with blanks when range is larger than values', () => {
        const values = sheet.getRange('A1:A10').getValues();

        expect(values.length).toEqual(10);
      });
      it('should fill in values using numbers for row and column', () => {
        const values = sheet.getRange(1, 3, 3, 1).getValues();

        expect(values).toEqual([['Name'], ['Kwickiemart'], ['Shopmart']]);
      });
    });

    describe('getValue', () => {
      it('should return value using numbers for row and column', () => {
        const value = sheet.getRange(2, 3).getValue();

        expect(value).toEqual('Kwickiemart');
      });
      it('should return value using a1 notation', () => {
        const value = sheet.getRange('C6').getValue();

        expect(value).toEqual('Wholepaycheck');
      });
      it('should only return top left value from range', () => {
        const value = sheet.getRange(3, 3, 2, 2).getValue();

        expect(value).toEqual('Shopmart');
      });
      it('should only return top left value from range using a1 notation', () => {
        const value = sheet.getRange('C5:D6').getValue();

        expect(value).toEqual('Gasmart');
      });
    });

    describe('setValues', () => {
      it('should throw error when range length does not match update', () => {
        const range = sheet.getRange('A2:D2');
        expect(range.getValues()).toEqual([
          ['2021-01-01', 1, 'Kwickiemart', 'Shops'],
        ]);
        try {
          // Update values and re-select new range from sheet
          range.setValues([
            [
              '2021-01-01',
              '6.32',
              'Kwickiemart',
              'Shops Also',
              'some extra column',
            ],
          ]);
        } catch (e: unknown) {
          if (e instanceof Error) {
            expect(e.message).toContain(
              'The number of columns in the data does not match the number of columns in the range'
            );
          }
        }
      });
    });

    describe('setValue', () => {
      it('should update cell value using numbers for row and column', () => {
        const expectedSheetData = [
          ['Date', 'Amount', 'Name', 'Category'],
          ['2021-01-01', 1, 'Kwickiemart', 'Shops'],
          ['2021-01-02', 1, 'Shopmart', 'Shops'],
          ['2021-01-03', 1, 'Newmart', 'Shops'],
          ['2021-01-03', 1, 'Gasmart', 'Gas'],
          ['2021-01-04', 1, 'Wholepaycheck', 'Groceries'],
        ];

        sheet.getRange(4, 3).setValue('Newmart');

        expect(sheet.getDataRange().getValues()).toEqual(expectedSheetData);
      });
      it('should update cell value using a1 notation', () => {
        const expectedSheetData = [
          ['Date', 'Amount', 'Name', 'Category'],
          ['2021-01-01', 1, 'Kwickiemart', 'Shops'],
          ['2021-01-02', 1, 'Shopmart', 'Shops'],
          ['2021-01-03', 1, 'Updatedmart', 'Shops'],
          ['2021-01-03', 1, 'Gasmart', 'Gas'],
          ['2021-01-04', 1, 'Wholepaycheck', 'Groceries'],
        ];

        sheet.getRange('C4').setValue('Updatedmart');

        expect(sheet.getDataRange().getValues()).toEqual(expectedSheetData);
      });
    });
  });
}
