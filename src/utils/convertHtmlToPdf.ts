import { join } from "path";
import { launch } from "puppeteer";

export async function convertHtmlToPdf(
  url: string,
  downloadDir: string,
  defaultName: string
) {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  console.log(process.env);
  console.log(downloadDir);
  await page.pdf({
    path: join(downloadDir, defaultName),
    format: "a3",
  });
  browser.close();
}
