import { normalize } from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

export async function getOSSpecificPath() {
  switch (process.platform) {
    case "win32":
      return await getPathWindows();

    case "darwin":
      return await getPathLinux();

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
