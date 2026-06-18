import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const distDir = new URL("./dist/", import.meta.url);
const rootDir = new URL("./", import.meta.url);

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  await cp(new URL(`./${file}`, rootDir), new URL(`./${file}`, distDir));
}

for (const file of ["robots.txt", "sitemap.xml"]) {
  const source = new URL(`./${file}`, rootDir);
  if (existsSync(fileURLToPath(source))) {
    await copyFile(source, new URL(`./${file}`, distDir));
  }
}

for (const file of ["yandex_bbc78a852b9265f8.html"]) {
  const source = new URL(`./${file}`, rootDir);
  if (existsSync(fileURLToPath(source))) {
    await copyFile(source, new URL(`./${file}`, distDir));
  }
}

await cp(new URL("./public/", rootDir), new URL("./public/", distDir), {
  recursive: true,
});
