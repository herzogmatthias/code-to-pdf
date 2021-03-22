import { promises, statSync } from "fs";
import { extname, join } from "path";
import { Settings } from "../models/Settings";
import { TreeNode } from "../models/TreeNode";
import * as vscode from "vscode";

export async function buildTree(rootPath: string) {
  const settings = Settings.getInstance(vscode.workspace.getConfiguration());
  const root = new TreeNode(rootPath);

  const stack = [root];

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode) {
      const children = await promises.readdir(currentNode.path);
      const filePromises = [];
      for (let child of children) {
        const childPath = join(currentNode.path, child);
        const childNode = new TreeNode(childPath);

        const isDirectory = statSync(childNode.path).isDirectory();
        const extension = extname(childNode.path);
        childNode.ext = isDirectory ? undefined : extension.substring(1);

        const isFileBockled = settings.ignoredFileExtensions!.includes(
          extension
        );

        if (!isFileBockled) {
          currentNode.children.push(childNode);
          filePromises.push({
            id: childPath,
            code: isDirectory
              ? undefined
              : promises.readFile(childPath, "utf-8"),
          });
        }

        if (isDirectory && !isFileBockled) {
          stack.push(childNode);
        }
      }
      const data = await Promise.all(
        filePromises.map(async (fp) => {
          return { id: fp.id, code: await fp.code };
        })
      );

      data.forEach((fileData, ind) => {
        currentNode.children[ind].code = fileData.code;
      });
    }
  }

  return root;
}
