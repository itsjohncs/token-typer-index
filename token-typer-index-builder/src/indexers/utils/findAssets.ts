import fg from "fast-glob";

import getAssetDirectory from "./getAssetDirectory.js";

export default function findAssets(pattern: string): Promise<string[]> {
    return fg.glob(pattern, {
        cwd: getAssetDirectory(),
    });
}
