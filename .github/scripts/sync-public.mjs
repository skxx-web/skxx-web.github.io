import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const output = path.join(root, "public");
const excluded = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".nojekyll",
  "CNAME",
  "README.md",
  "public",
  "node_modules",
  "package.json",
  "pnpm-lock.yaml",
]);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name.startsWith(".")) continue;
  const source = path.join(root, entry.name);
  const destination = path.join(output, entry.name);
  if (entry.isDirectory()) {
    await cp(source, destination, { recursive: true, dereference: true });
  } else if (entry.isFile()) {
    await cp(source, destination);
  }
}

console.log("Cloudflare Pages public/ mirror synchronized from the static site root.");
