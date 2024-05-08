import {buildIndex} from "../src/index.js";

async function main() {
    console.log(await buildIndex());
}

// @ts-expect-error TypeScript doesn't know a top-level await is OK here
await main();
