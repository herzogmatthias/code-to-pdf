import { expect } from "chai";
import * as assert from "assert";
import { getOSSpecificPath } from "../../utils/getOSSpecificPath";
import { launch } from "puppeteer-core";

suite("Browser Execution Path test Suite", () => {
  test("should return correct Path for different OS", async () => {
    const path = await getOSSpecificPath();

    if (process.platform === "win32") {
      expect(path).to.include("chrome.exe");
    } else if (process.platform === "darwin") {
      expect(path).to.be.eq(
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      );
    } else {
      expect(path).to.be.eq("/usr/bin/google-chrome");
    }
  });
  test("should start Browser with the right path", async () => {
    const path = await getOSSpecificPath();
    console.log(path);
    try {
      const browser = await launch({
        headless: true,
        executablePath: path,
        args: ["-wait-for-browser", "--no-sandbox", "--disable-setuid-sandbox"],
      });
      await browser.close();
      assert(true, "Browser is running");
    } catch (e: any) {
      console.log(e);
      assert(false, e);
    }
  });
});
