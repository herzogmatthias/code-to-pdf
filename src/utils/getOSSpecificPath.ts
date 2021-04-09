import { normalize } from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

export async function getOSSpecificPath() {
  const command = "";
  switch (process.platform) {
    case "win32":
      return await getPathWindows();

    case "darwin":
      break;
    default:
      break;
  }
}

async function getPathWindows() {
  const normQuery = normalize(
    "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths"
  );
  const { stdout } = await execPromise(`reg QUERY "${normQuery}" /s`);
  const chunks = [];

  for await (let chunk of stdout!) {
    chunks.push(Buffer.from(chunk));
  }

  const buffer = Buffer.concat(chunks);
  const str = buffer.toString("utf-8");
  let browser: string | undefined = "";
  browser = str.match(/\s*(Standard).*chrome.exe/)
    ? str.match(/\s*(Standard).*chrome.exe/)![0]
    : str.match(/\s*(Standard).*firefox.exe/)![0];
  if (!browser) return undefined;

  const path = browser.trim().substr(23);
  return path;
}
