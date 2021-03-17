import { join } from "path";
import { buildTree } from "../../utils/buildTree";
import { expect } from "chai";

suite("buildTree", () => {
  const initialPath = join(__dirname, "..", "..");

  test("should return root node", () => {
    const rootNode = buildTree(initialPath);

    expect(rootNode).not.to.be.a("null");
    expect(rootNode).has.property("path", initialPath);
    expect(rootNode).has.property("children");
  });
  test("should return root node with its exact 7 children", () => {
    const rootNode = buildTree(initialPath);
    expect(rootNode.children.length).to.eq(7);

    const childrenPath = rootNode.children.map((child) => child.path);
    expect(childrenPath.includes(`${initialPath}/commands`)).to.eq(true);
    expect(childrenPath.includes(`${initialPath}/extension.js`)).to.eq(true);
  });
});
