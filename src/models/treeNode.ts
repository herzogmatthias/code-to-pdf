export class TreeNode {
  public path: string;
  public ext?: string;
  public children: Array<TreeNode>;

  constructor(path: string, ext?: string) {
    this.path = path;
    this.ext = ext;
    this.children = [];
  }
}
