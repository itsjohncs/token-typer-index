import path from "node:path";

import findAssets from "./utils/findAssets.js";
import type Asset from "../Asset.js";

function stripExtension(name: string): string {
    return name.replace(/\.\w+$/, "");
}

function tokenizeName(name: string): string[] {
    return name.split(/(?:(?=[A-Z])|\W+)/);
}

export async function buildIndex(): Promise<Asset[]> {
    const result: Asset[] = [];
    for (const asset of await findAssets("too-many-tokens-dnd/**/*.webp")) {
        const tags = tokenizeName(stripExtension(path.basename(asset)));
        result.push({
            path: asset,
            tags,
        });
    }
    return result;
}
