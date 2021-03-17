import { readdirSync, statSync } from "fs";
import { extname } from "path";
import { TreeNode } from "../models/treeNode";

export function buildTree(rootPath: string) {
  const BLOCKED_EXTENSIONS = [".txt"];
  const root = new TreeNode(rootPath);

  const stack = [root];

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode) {
      const children = readdirSync(currentNode.path);

      for (let child of children) {
        const childPath = `${currentNode.path}/${child}`;
        const childNode = new TreeNode(childPath);

        const isDirectory = statSync(childNode.path).isDirectory();
        const extension = extname(childNode.path);
        childNode.ext = isDirectory ? undefined : extension;
        const isFileBockled = BLOCKED_EXTENSIONS.includes(extension);

        if (!isFileBockled) {
          currentNode.children.push(childNode);
        }

        if (isDirectory && !isFileBockled) {
          stack.push(childNode);
        }
      }
    }
  }

  return root;
}
