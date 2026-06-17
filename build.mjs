import { cp, mkdir, rm } from "node:fs/promises";

const distDir = new URL("./dist/", import.meta.url);
const rootDir = new URL("./", import.meta.url);

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  await cp(new URL(`./${file}`, rootDir), new URL(`./${file}`, distDir));
}

await cp(new URL("./public/", rootDir), new URL("./public/", distDir), {
  recursive: true,
});
