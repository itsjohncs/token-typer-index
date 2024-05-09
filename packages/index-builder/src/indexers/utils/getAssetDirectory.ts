import path from "node:path";
import {fileURLToPath} from "node:url";

export default function getAssetDirectory(): string {
    const filePath = fileURLToPath(import.meta.url);
    return path.resolve(filePath, "../../../../../../assets");
}
