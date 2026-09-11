import { readFile } from "node:fs/promises";

const releases = await readFile(new URL("../public/releases.json", import.meta.url), "utf8");

console.log(`Loaded ${JSON.parse(releases).length} tracked releases.`);
console.log("Automated source polling will be implemented in the next milestone.");
