import * as vscode from "vscode";
import { createServer } from "http";
import { promises, statSync, readFile } from "fs";

import { join, extname } from "path";
import { convertHtmlToPdf } from "../utils/convertHtmlToPdf";
import { TreeNode } from "../models/treeNode";
import { buildTree } from "../utils/buildTree";

export async function printDefinitionsForActiveEditor(uri: vscode.Uri) {
  console.log(uri.fsPath);
  let isDir = statSync(uri.fsPath).isDirectory();
  let tree: TreeNode | undefined = undefined;
  let flattendArray: Array<TreeNode> = [];
  if (isDir) {
    tree = await buildTree(uri.fsPath);

    flattendArray = tree
      .getFlat(tree)
      .filter((fa: any) => fa.ext !== undefined);
  } else {
    tree = new TreeNode(
      uri.fsPath,
      extname(uri.fsPath).substring(1),
      await promises.readFile(uri.fsPath, "utf-8")
    );
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
        res.end(
          JSON.stringify(
            isDir
              ? flattendArray
              : { code: tree?.code, ext: tree?.ext, path: tree?.path }
          )
        );
        break;
      default:
        break;
    }
  }).listen(8080);
  vscode.env.openExternal(vscode.Uri.parse("http://localhost:8080"));

  await convertHtmlToPdf("http://localhost:8080");
}
