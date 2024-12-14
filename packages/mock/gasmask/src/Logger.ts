/**
 * Shared utilities for all Google Apps Script projects
 */
export class LoggerClass implements GoogleAppsScript.Base.Logger {
  protected innerLogs: any[];

  constructor() {
    this.innerLogs = [];
  }

  clear(): void {
    this.innerLogs = [];
  }
  getLog(): string {
    return String(this.innerLogs[this.innerLogs.length - 1]);
  }
  log(data: any): GoogleAppsScript.Base.Logger {
    this.innerLogs.push(data);
    // console.log(data);
    return this;
  }
}
