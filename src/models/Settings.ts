import { WorkspaceConfiguration } from "vscode";

/**
 * Stores the Settings for the extension
 *
 * @class Settings
 */
export class Settings {
  private static instance: Settings;
  openHTMLPageInBrowser?: boolean;
  ignoredFileExtensions?: string[];

  private constructor(config: WorkspaceConfiguration) {
    this.openHTMLPageInBrowser = config.get("codeToPdf.openHTMLPageInBrowser");
    this.ignoredFileExtensions = config.get("codeToPdf.ignoredFileExtensions");
  }
  public static getInstance(config: WorkspaceConfiguration): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings(config);
    }
    if (
      config.get("codeToPdf.openHTMLPageInBrowser") !==
      this.instance.openHTMLPageInBrowser
    ) {
      this.instance.openHTMLPageInBrowser = config.get(
        "codeToPdf.openHTMLPageInBrowser"
      );
    }
    if (
      config.get("codeToPdf.ignoredFileExtensions") !==
      this.instance.openHTMLPageInBrowser
    ) {
      this.instance.ignoredFileExtensions = config.get(
        "codeToPdf.ignoredFileExtensions"
      );
    }
    return Settings.instance;
  }
}
