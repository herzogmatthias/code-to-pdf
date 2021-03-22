import * as vscode from "vscode";
import { convertHtmlToPdf } from "../utils/convertHtmlToPdf";
import { ServerManager } from "../models/ServerManager";
import { Settings } from "../models/Settings";

export async function codeToPdf(uri: vscode.Uri) {
  const settings = Settings.getInstance(vscode.workspace.getConfiguration());
  console.log(uri.fsPath);

  const serverManager = new ServerManager(uri);

  if (settings.openHTMLPageInBrowser) {
    vscode.env.openExternal(
      vscode.Uri.parse(
        `http://localhost:${(serverManager.server.address()! as any).port}`
      )
    );
  }

  await convertHtmlToPdf(
    `http://localhost:${(serverManager.server.address()! as any).port}`
  );
  serverManager.server.close();
}
