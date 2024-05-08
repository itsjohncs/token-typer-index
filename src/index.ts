import Asset from "./Asset";
import {buildIndex as buildTooManyTokensIndex} from "./indexers/tooManyTokens";

export async function buildIndex(): Promise<Asset[]> {
    return buildTooManyTokensIndex();
}
