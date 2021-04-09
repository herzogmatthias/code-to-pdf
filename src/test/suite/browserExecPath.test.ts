import { expect } from "chai";
import { getOSSpecificPath } from "../../utils/getOSSpecificPath";

suite("Browser Execution Path test Suite", () => {
  test("should return correct Path for different OS", async () => {
    const path = await getOSSpecificPath();

    if (process.platform === "win32") {
      expect(path).to.include("chrome.exe");
    } else {
      expect(path).to.be("/usr/bin/google-chrome");
    }
  });
});
