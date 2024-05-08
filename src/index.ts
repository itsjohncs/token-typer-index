import {search} from "token-typer-index-searcher";

import Asset from "./Asset.js";
import Tag from "./Tag.js";
import {buildIndex as buildTooManyTokensIndex} from "./indexers/tooManyTokens.js";

interface Index {
    assets: Asset[];
    tags: Tag[];
}

export async function buildIndex(): Promise<Index> {
    const assets = await buildTooManyTokensIndex();

    const tags: Tag[] = [];
    const allNamedTags = new Set<string>(assets.flatMap((asset) => asset.tags));
    for (const name of allNamedTags) {
        tags.push({
            canonical: [name],
            aliases: [],
        });
    }

    return {
        assets,
        tags,
    };
}
