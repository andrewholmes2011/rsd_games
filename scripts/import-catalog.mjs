import { writeFile } from "node:fs/promises";
const url = "https://d3kdhak6ujo42c.cloudfront.net/catalog.json";
const response = await fetch(url, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error("Catalog download failed: HTTP " + response.status);
const catalog = await response.json();
if (!Array.isArray(catalog.games)) throw new Error("Unexpected catalog format: expected a games array");
await writeFile(new URL("../public/catalog.json", import.meta.url), JSON.stringify(catalog, null, 2) + "\n");
console.log("Imported " + catalog.games.length + " games into public/catalog.json");