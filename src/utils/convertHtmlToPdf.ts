import { writeFileSync } from "fs";
import { launch } from "puppeteer-core";
import { window } from "vscode";
import { getOSSpecificPath } from "./getOSSpecificPath";
import * as vscode from "vscode";
export async function convertHtmlToPdf(url: string) {
  const path = await getOSSpecificPath();
  if (!path) {
    window.showErrorMessage(
      "You do not have the necassary Browser please convert to pdf manually(please use Firefox or Chrome!)"
    );
    vscode.env.openExternal(vscode.Uri.parse(url));
    return;
  }
  const browser = await launch({
    headless: true,

    executablePath: path,
    args: ["-wait-for-browser"],
    product: path.toLowerCase().includes("firefox") ? "firefox" : "chrome",
  });
  const page = await browser.newPage();
  console.log("converting");
  await page.goto(url);
  try {
    await page.waitForTimeout(500);
  } catch (e) {
    console.error(e);
    window.showErrorMessage("Something went wrong when converting the Files");
    await browser.close();
  }

  try {
    const pdf = await page.pdf({
      format: "a3",
    });
    window
      .showSaveDialog({ filters: { pdf: ["pdf"] } })
      .then(async (fileInfo) => {
        try {
          writeFileSync(fileInfo!.fsPath, pdf);
        } catch (e) {
          console.log(e);
          window.showErrorMessage("Something went wrong when saving the Files");
          await browser.close();
        }
      });
  } catch (e) {
    console.log(e);
    window.showErrorMessage("Something went wrong when converting the Files");
    browser.process()?.kill("SIGINT");
    await browser.close();
  }
  browser.process()?.kill("SIGINT");
  await browser.close();
  return;
}
