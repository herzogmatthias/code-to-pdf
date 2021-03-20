/**
 * Tree in case someone wants to convert a directory
 *
 * @class TreeNode
 */
export class TreeNode {
  public path: string;
  public ext?: string;
  public code?: string;
  public children: Array<TreeNode>;

  constructor(path: string, ext?: string, code?: string) {
    this.path = path;
    this.ext = ext;
    this.code = code;
    this.children = [];
  }

  public getFlat({ path, ext, code, children = [] }: TreeNode): any {
    return children.reduce((r, o) => [...r, ...this.getFlat(o)], [
      { path, ext, code },
    ]);
  }
}
