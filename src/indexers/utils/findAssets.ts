import {promisify} from "util";

import glob_ from "glob";

import getAssetDirectory from "./getAssetDirectory.js";

const glob = promisify(glob_.glob);

export default function findAssets(pattern: string): Promise<string[]> {
    return glob(pattern, {
        cwd: getAssetDirectory(),
    });
}
