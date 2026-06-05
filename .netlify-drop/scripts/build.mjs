import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (existsSync("prisma/schema.prisma")) {
  run(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "generate"]);
}

run(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build", "--webpack"]);
