import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as myExtension from "../../extension";

suite("Extension Test Suite", () => {
  test("Extension should be present", () => {
    assert.ok(vscode.extensions.getExtension("herzogmatthias.codetopdf"));
  });

  test("should activate", async function () {
    this.timeout(1 * 60 * 1000);
    const api = await vscode.extensions
      .getExtension("herzogmatthias.codetopdf")!
      .activate();
    assert.ok(true);
  });

  test("should register all commands", async function () {
    const commands = await vscode.commands.getCommands(true);
    const COMMANDS = ["codetopdf.convert"];
    const codeToPdfCommands = commands.filter((value) => {
      return COMMANDS.indexOf(value) >= 0 || value.startsWith("codetopdf");
    });
    assert.strictEqual(codeToPdfCommands.length, COMMANDS.length);
  });
});
