import { writeFile } from "node:fs/promises";
const url = "https://d3kdhak6ujo42c.cloudfront.net/catalog.json";
const response = await fetch(url, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error("Catalog download failed: HTTP " + response.status);
const catalog = await response.json();
if (!Array.isArray(catalog.games)) throw new Error("Unexpected catalog format: expected a games array");
catalog.games = catalog.games.filter(game =>
  !(game.tags || []).some(tag => String(tag).toLowerCase().includes("shooter")) &&
  !/\b(blaster|firearm|gunfight)\b/i.test(String(game.title || ""))
);
await writeFile(new URL("../public/catalog.json", import.meta.url), JSON.stringify(catalog, null, 2) + "\n");
console.log("Imported " + catalog.games.length + " catalog entries into public/catalog.json");