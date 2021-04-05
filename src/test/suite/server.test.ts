import { join } from "path";
import { buildTree } from "../../utils/buildTree";
import { expect } from "chai";
import fetch from "node-fetch";
import { ServerManager } from "../../models/ServerManager";
import { Uri } from "vscode";

suite("Server test Suite", () => {
  const initialPath = join(__dirname, "..", "..");

  test("should serve a html page", async () => {
    const serverManager = new ServerManager(
      Uri.file(initialPath),
      join(__dirname, "..", "..", "template", "index.html")
    );
    const res = await fetch(
      `http://localhost:${(serverManager.server.address()! as any).port}`
    );

    serverManager.server.close();
    expect(res.ok).to.be.true;
  });
  test("should return code for a single file", async () => {
    const serverManager = new ServerManager(
      Uri.file(join(initialPath, "extension.js"))
    );
    const res = await fetch(
      `http://localhost:${(serverManager.server.address()! as any).port}/code`
    );
    const data = await res.json();
    serverManager.server.close();
    expect(data).to.haveOwnProperty("code");
    expect(res.ok).to.be.true;
  });
  test("should return an array for multiple files", async () => {
    const serverManager = new ServerManager(
      Uri.file(join(initialPath, "models"))
    );
    const res = await fetch(
      `http://localhost:${(serverManager.server.address()! as any).port}/code`
    );
    const data = await res.json();
    serverManager.server.close();
    expect(data).not.to.have.lengthOf(0);
    expect(res.ok).to.be.true;
  });
});
