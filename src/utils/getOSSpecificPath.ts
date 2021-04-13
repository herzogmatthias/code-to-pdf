import { normalize } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { Settings } from "../models/Settings";
import { workspace } from "vscode";
const execPromise = promisify(exec);

export async function getOSSpecificPath() {
  switch (process.platform) {
    case "win32":
      return await getPathWindows();

    case "darwin":
      if (
        Settings.getInstance(workspace.getConfiguration())
          .pathForBrowserExec !== ""
      ) {
        return normalize(
          Settings.getInstance(workspace.getConfiguration()).pathForBrowserExec!
        );
      }
      return existsSync(
        normalize(
          "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome"
        )
      )
        ? normalize(
            "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome"
          )
        : existsSync(
            normalize("/Applications/Firefox.app/Contents/MacOS/firefox")
          )
        ? normalize("/Applications/Firefox.app/Contents/MacOS/firefox")
        : undefined;

    default:
      return await getPathLinux();
  }
}

async function getPathLinux() {
  let browser: string | undefined = "";
  browser = await execCommand(`which google-chrome`);
  if (!browser) {
    browser = await execCommand("which firefox");
  }
  if (!browser) {
    return undefined;
  }
  return browser.trim();
}
async function getPathWindows() {
  const normQuery = normalize(
    "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths"
  );
  const str = await execCommand(`reg QUERY "${normQuery}" /s`);
  let browser: string | undefined = "";
  browser = str.match(/\s*(Standard).*chrome.exe/)
    ? str.match(/\s*(Standard).*chrome.exe/)![0]
    : str.match(/\s*(Standard).*firefox.exe/)![0];
  if (!browser) {
    return undefined;
  }

  const path = browser.trim().substr(23);
  return path.trim();
}

async function execCommand(command: string) {
  const { stdout } = await execPromise(command);
  const chunks = [];

  for await (let chunk of stdout!) {
    chunks.push(Buffer.from(chunk));
  }

  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8");
}
