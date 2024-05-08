import path from "node:path";

export default function getAssetDirectory(): string {
    return path.resolve(import.meta.dirname, "../../../../assets");
}
