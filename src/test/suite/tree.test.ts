import { join } from "path";
import { buildTree } from "../../utils/buildTree";
import { expect } from "chai";

suite("Tree test Suite", () => {
  const initialPath = join(__dirname, "..", "..");

  test("should return root node", async () => {
    const rootNode = await buildTree(initialPath);

    expect(rootNode).not.to.be.a("null");
    expect(rootNode).has.property("path", initialPath);
    expect(rootNode).has.property("children");
  });
  test("should return root node with its exact 7 children", async () => {
    const rootNode = await buildTree(initialPath);
    expect(rootNode.children.length).to.eq(7);

    const childrenPath = rootNode.children.map((child) => child.path);
    expect(childrenPath.includes(join(initialPath, "commands"))).to.eq(true);
    expect(childrenPath.includes(join(initialPath, "extension.js"))).to.eq(
      true
    );
  });
  test("should flatten the tree", async () => {
    const rootNode = await buildTree(initialPath);
    const arr = rootNode.getFlat(rootNode);
    expect(arr[0].ext).to.eq(undefined);
  });
});
