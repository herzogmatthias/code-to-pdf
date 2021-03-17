import { join } from "path";
import { launch } from "puppeteer";

export async function convertHtmlToPdf(url: string) {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  console.log(process.env);
  await page.pdf({
    path: join(
      process.env.HOME || process.env.USERPROFILE || "",
      "downloads",
      "code.pdf"
    ),
  });
  browser.close();
}
