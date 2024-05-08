import Asset from "./Asset.js";
import {buildIndex as buildTooManyTokensIndex} from "./indexers/tooManyTokens.js";

export async function buildIndex(): Promise<Asset[]> {
    return buildTooManyTokensIndex();
}
