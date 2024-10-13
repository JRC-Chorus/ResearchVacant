import { RangeClass } from './SpreadsheetApp/Range';
import { SheetClass } from './SpreadsheetApp/Sheet';
import { SpreadsheetClass } from './SpreadsheetApp/Spreadsheet';

/**
 * Main SpreadsheetApp class
 */
class SpreadsheetAppClass
  implements GoogleAppsScript.Spreadsheet.SpreadsheetApp
{
  activeSpreadsheet = new SpreadsheetClass();

  AutoFillSeries!: typeof GoogleAppsScript.Spreadsheet.AutoFillSeries;
  BandingTheme!: typeof GoogleAppsScript.Spreadsheet.BandingTheme;
  BooleanCriteria!: typeof GoogleAppsScript.Spreadsheet.BooleanCriteria;
  BorderStyle!: typeof GoogleAppsScript.Spreadsheet.BorderStyle;
  ColorType!: typeof GoogleAppsScript.Base.ColorType;
  CopyPasteType!: typeof GoogleAppsScript.Spreadsheet.CopyPasteType;
  DataExecutionErrorCode!: typeof GoogleAppsScript.Spreadsheet.DataExecutionErrorCode;
  DataExecutionState!: typeof GoogleAppsScript.Spreadsheet.DataExecutionState;
  DataSourceParameterType!: typeof GoogleAppsScript.Spreadsheet.DataSourceParameterType;
  DataSourceType!: typeof GoogleAppsScript.Spreadsheet.DataSourceType;
  DataValidationCriteria!: typeof GoogleAppsScript.Spreadsheet.DataValidationCriteria;
  DeveloperMetadataLocationType!: typeof GoogleAppsScript.Spreadsheet.DeveloperMetadataLocationType;
  DeveloperMetadataVisibility!: typeof GoogleAppsScript.Spreadsheet.DeveloperMetadataVisibility;
  Dimension!: typeof GoogleAppsScript.Spreadsheet.Dimension;
  Direction!: typeof GoogleAppsScript.Spreadsheet.Direction;
  GroupControlTogglePosition!: typeof GoogleAppsScript.Spreadsheet.GroupControlTogglePosition;
  InterpolationType!: typeof GoogleAppsScript.Spreadsheet.InterpolationType;
  PivotTableSummarizeFunction!: typeof GoogleAppsScript.Spreadsheet.PivotTableSummarizeFunction;
  PivotValueDisplayType!: typeof GoogleAppsScript.Spreadsheet.PivotValueDisplayType;
  ProtectionType!: typeof GoogleAppsScript.Spreadsheet.ProtectionType;
  RecalculationInterval!: typeof GoogleAppsScript.Spreadsheet.RecalculationInterval;
  RelativeDate!: typeof GoogleAppsScript.Spreadsheet.RelativeDate;
  SheetType!: typeof GoogleAppsScript.Spreadsheet.SheetType;
  TextDirection!: typeof GoogleAppsScript.Spreadsheet.TextDirection;
  TextToColumnsDelimiter!: typeof GoogleAppsScript.Spreadsheet.TextToColumnsDelimiter;
  ThemeColorType!: typeof GoogleAppsScript.Spreadsheet.ThemeColorType;
  ValueType!: typeof GoogleAppsScript.Spreadsheet.ValueType;
  WrapStrategy!: typeof GoogleAppsScript.Spreadsheet.WrapStrategy;
  create(
    name: string,
    rows?: number,
    columns?: number
  ): GoogleAppsScript.Spreadsheet.Spreadsheet {
    this.activeSpreadsheet = new SpreadsheetClass(name, rows, columns);

    return this.activeSpreadsheet;
  }
  enableAllDataSourcesExecution(): void {
    throw new Error('Method not implemented.');
  }
  enableBigQueryExecution(): void {
    throw new Error('Method not implemented.');
  }
  flush(): void {
    throw new Error('Method not implemented.');
  }
  getActive(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    throw new Error('Method not implemented.');
  }
  getActiveRange(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getActiveRangeList(): GoogleAppsScript.Spreadsheet.RangeList {
    throw new Error('Method not implemented.');
  }
  getActiveSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return this.activeSpreadsheet.getActiveSheet();
  }
  getActiveSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    return this.activeSpreadsheet;
  }
  getCurrentCell(): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }
  getSelection(): GoogleAppsScript.Spreadsheet.Selection {
    throw new Error('Method not implemented.');
  }
  getUi(): GoogleAppsScript.Base.Ui {
    throw new Error('Method not implemented.');
  }
  newCellImage(): GoogleAppsScript.Spreadsheet.CellImageBuilder {
    throw new Error('Method not implemented.');
  }
  newColor(): GoogleAppsScript.Spreadsheet.ColorBuilder {
    throw new Error('Method not implemented.');
  }
  newConditionalFormatRule(): GoogleAppsScript.Spreadsheet.ConditionalFormatRuleBuilder {
    throw new Error('Method not implemented.');
  }
  newDataSourceSpec(): GoogleAppsScript.Spreadsheet.DataSourceSpecBuilder {
    throw new Error('Method not implemented.');
  }
  newDataValidation(): GoogleAppsScript.Spreadsheet.DataValidationBuilder {
    throw new Error('Method not implemented.');
  }
  newFilterCriteria(): GoogleAppsScript.Spreadsheet.FilterCriteriaBuilder {
    throw new Error('Method not implemented.');
  }
  newRichTextValue(): GoogleAppsScript.Spreadsheet.RichTextValueBuilder {
    throw new Error('Method not implemented.');
  }
  newTextStyle(): GoogleAppsScript.Spreadsheet.TextStyleBuilder {
    throw new Error('Method not implemented.');
  }
  open(
    file: GoogleAppsScript.Drive.File
  ): GoogleAppsScript.Spreadsheet.Spreadsheet {
    throw new Error('Method not implemented.');
  }
  openById(id: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
    throw new Error('Method not implemented.');
  }
  openByUrl(url: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
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
  setActiveSheet(
    sheet: unknown,
    restoreSelection?: unknown
  ): GoogleAppsScript.Spreadsheet.Sheet {
    throw new Error('Method not implemented.');
  }
  setActiveSpreadsheet(
    newActiveSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ): void {
    throw new Error('Method not implemented.');
  }
  setCurrentCell(
    cell: GoogleAppsScript.Spreadsheet.Range
  ): GoogleAppsScript.Spreadsheet.Range {
    throw new Error('Method not implemented.');
  }

  static flush() {}
}

export const SpreadsheetApp = SpreadsheetAppClass;
export const Spreadsheet = SpreadsheetClass;
export const Sheet = SheetClass;
export const Range = RangeClass;

/** In Source Testing */
if (import.meta.vitest) {
  const { expect, describe, it } = import.meta.vitest;

  describe('SpreadsheetApp', () => {
    it('should return a Spreadsheet instance when calling getActiveSpreadsheet()', () => {
      const ssApp = new SpreadsheetAppClass();
      expect(ssApp.getActiveSpreadsheet()).toBeInstanceOf(SpreadsheetClass);
    });
  });
}
