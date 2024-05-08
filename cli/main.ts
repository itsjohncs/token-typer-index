import util from "node:util";

import {buildIndex} from "../src/index.js";
import { createQueryPlan } from "token-typer-index-searcher";

async function main() {
    const index = await buildIndex();

    if (process.argv.length <= 1) {
        console.log(
            util.inspect(index, {depth: null, colors: true, maxArrayLength: null}),
        );
    } else {
        const plan = createQueryPlan(index.tags, process.argv.slice(1).join(" "));
        console.log(plan);
    }
}

await main();
