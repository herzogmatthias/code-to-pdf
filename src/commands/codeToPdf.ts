import * as vscode from "vscode";
import { createServer } from "http";
import { readFile } from "fs";
import { join } from "path";
import { convertHtmlToPdf } from "../utils/convertHtmlToPdf";

export async function printDefinitionsForActiveEditor(uri: vscode.Uri) {
  console.log(uri);
  const activeEditor = vscode.window.activeTextEditor;
  const text = activeEditor?.document.getText();
  createServer(function (req, res) {
    console.log(req.url);
    switch (req.url) {
      case "/":
        readFile(
          join(__dirname, "..", "template", "index.html"),
          function (err, data) {
            if (err) {
              res.writeHead(404);
              res.end(JSON.stringify(err));
              return;
            }
            res.writeHead(200);
            res.end(data);
          }
        );
        break;
      case "/code":
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify({ code: text }));
        break;
      default:
        break;
    }
  }).listen(8080);
  vscode.env.openExternal(vscode.Uri.parse("http://localhost:8080"));

  await convertHtmlToPdf("http://localhost:8080");
}
