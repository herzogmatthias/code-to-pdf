import * as vscode from "vscode";
import { createServer } from "http";
import { promises, statSync, readFile } from "fs";

import { join, extname } from "path";
import { convertHtmlToPdf } from "../utils/convertHtmlToPdf";
import { TreeNode } from "../models/treeNode";
import { buildTree } from "../utils/buildTree";

export async function printDefinitionsForActiveEditor(uri: vscode.Uri) {
  const openHTMLPage = vscode.workspace
    .getConfiguration()
    .get("codeToPdf.openHTMLPageInBrowser");
  console.log(uri.fsPath);
  let isDir = statSync(uri.fsPath).isDirectory();
  let downloadDir = isDir
    ? uri.fsPath
    : join(...uri.path.split("/").splice(0, uri.path.split("/").length - 1));
  let tree: TreeNode | undefined = undefined;
  let defaultName: string = isDir
    ? uri.path.split("/")[uri.path.split("/").length - 1]
    : uri.path.split("/")[uri.path.split("/").length - 1].split(".")[0];
  defaultName += "_code.pdf";
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
  const server = createServer(function (req, res) {
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
  }).listen(0);

  if (openHTMLPage) {
    vscode.env.openExternal(
      vscode.Uri.parse(`http://localhost:${(server.address()! as any).port}`)
    );
  }

  await convertHtmlToPdf(
    `http://localhost:${(server.address()! as any).port}`,
    downloadDir,
    defaultName
  );
  server.close();
}
