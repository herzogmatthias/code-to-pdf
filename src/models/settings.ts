import { WorkspaceConfiguration } from "vscode";

export class Settings {
  openHTMLPageInBrowser?: boolean;

  constructor(config: WorkspaceConfiguration) {
    this.openHTMLPageInBrowser = config.get("codeToPdf.openHTMLPageInBrowser");
  }
}
