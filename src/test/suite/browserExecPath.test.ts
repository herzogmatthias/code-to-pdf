import { expect } from "chai";
import { getOSSpecificPath } from "../../utils/getOSSpecificPath";

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
});
