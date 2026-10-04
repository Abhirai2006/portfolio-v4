// One-time download of the older project screenshots and the share image from the
// original site, into public/media/. Works on Windows, macOS and Linux.
//
//   node scripts/fetch-assets.mjs
//
// Run it while the old site is still online. Files that already exist are skipped.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const OLD = "https://portfolio-abhirai2006.lovable.app/__l5e/assets-v1";
const FILES = [
  ["og-cover.jpg", "bd600cea-8d14-4ee4-bc94-680949395fcc"],
  ["muse-1.png", "886d6291-e893-4d97-9f29-7f7c9cd80c55"],
  ["muse-2.png", "aba22fd1-43f1-4359-a6ef-0afe43739aca"],
  ["muse-3.png", "272da648-78af-4007-b9be-8b93c1df0ed7"],
  ["sort-1.png", "7fdc2448-d5db-41f6-9776-6a6acb3857e2"],
  ["sort-2.png", "1e16aae1-1c9a-40af-9f5c-7f01109f6bcf"],
  ["sort-3.png", "a0520801-7cf5-4e6d-acf1-6737b9b65635"],
  ["bs-1.png", "c3d0564b-e9b6-4e1f-a67e-4024c48f07e9"],
  ["bs-2.png", "24968e74-511b-43b6-9a78-5bd2cc6d6303"],
  ["bs-3.png", "9c81a71a-70c1-49a6-b949-dba7f76ffd71"],
];

mkdirSync("public/media", { recursive: true });
let failed = 0;
for (const [name, id] of FILES) {
  const target = `public/media/${name}`;
  if (existsSync(target)) {
    console.log(`skip    ${name} (already there)`);
    continue;
  }
  try {
    const res = await fetch(`${OLD}/${id}/${name}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    console.log(`saved   ${name}`);
  } catch (err) {
    failed += 1;
    console.log(`FAILED  ${name}: ${err.message}`);
  }
}
console.log(failed ? `\n${failed} file(s) failed. Check that the old site is still online.` : "\nAll done. Commit public/media/ next.");
