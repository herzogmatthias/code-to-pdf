import { WorkspaceConfiguration } from "vscode";

/**
 * Stores the Settings for the extension
 *
 * @class Settings
 */
export class Settings {
  openHTMLPageInBrowser?: boolean;

  constructor(config: WorkspaceConfiguration) {
    this.openHTMLPageInBrowser = config.get("codeToPdf.openHTMLPageInBrowser");
  }
}
