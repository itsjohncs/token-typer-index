import util from "node:util";

import {buildIndex} from "../src/index.js";

async function main() {
    const index = await buildIndex();
    console.log(
        util.inspect(index, {depth: null, colors: true, maxArrayLength: null}),
    );
}

// @ts-expect-error TypeScript doesn't know a top-level await is OK here
await main();
