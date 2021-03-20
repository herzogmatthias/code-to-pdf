import { writeFileSync } from "fs";
import { join } from "path";
import { launch } from "puppeteer";
import { window } from "vscode";

export async function convertHtmlToPdf(url: string) {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  try {
    const pdf = await page.pdf({
      format: "a3",
    });
    window.showSaveDialog({ filters: { pdf: ["pdf"] } }).then((fileInfo) => {
      writeFileSync(fileInfo!.fsPath, pdf);
    });
  } catch (e) {
    console.log(e);
    window.showErrorMessage("Something went wrong when converting the Files");
  }

  browser.close();
  return;
}
