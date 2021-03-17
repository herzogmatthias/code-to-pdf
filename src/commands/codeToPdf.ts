import * as vscode from "vscode";
import { createServer } from "http";
import { promises, statSync, readFile } from "fs";

import { join } from "path";
import { convertHtmlToPdf } from "../utils/convertHtmlToPdf";
import { TreeNode } from "../models/treeNode";
import { buildTree } from "../utils/buildTree";

export async function printDefinitionsForActiveEditor(uri: vscode.Uri) {
  console.log(uri.fsPath);
  let text = "";
  let tree: TreeNode | undefined = undefined;
  if (statSync(uri.fsPath).isDirectory()) {
    tree = buildTree(uri.fsPath);
  } else {
    text = await promises.readFile(uri.fsPath, { encoding: "utf-8" });
  }
  console.log(tree);
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
