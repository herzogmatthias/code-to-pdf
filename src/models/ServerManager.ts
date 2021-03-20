import { Server } from "http";
import { createServer } from "http";
import { promises, readFile, statSync } from "fs";
import { ServerResponse } from "http";
import { join, extname } from "path";
import { Uri } from "vscode";
import { buildTree } from "../utils/buildTree";
import { TreeNode } from "./TreeNode";

export class ServerManager {
  server: Server;
  uri: Uri;
  constructor(uri: Uri) {
    this.uri = uri;
    this.server = createServer(async (req, res) => {
      switch (req.url) {
        case "/":
          this.serveHTML(res);
          break;
        case "/code":
          await this.sendCode(res);
          break;
        default:
          break;
      }
    }).listen(0);
  }
  private async sendCode(res: ServerResponse) {
    let isDir = statSync(this.uri.fsPath).isDirectory();
    let tree: TreeNode | undefined = undefined;
    let flattendArray: Array<TreeNode> = [];
    if (isDir) {
      tree = await buildTree(this.uri.fsPath);

      flattendArray = tree
        .getFlat(tree)
        .filter((fa: any) => fa.ext !== undefined);
    } else {
      tree = new TreeNode(
        this.uri.fsPath,
        extname(this.uri.fsPath).substring(1),
        await promises.readFile(this.uri.fsPath, "utf-8")
      );
    }
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(
      JSON.stringify(
        isDir
          ? flattendArray
          : { code: tree?.code, ext: tree?.ext, path: tree?.path }
      )
    );
  }

  private serveHTML(res: ServerResponse) {
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
  }
}
