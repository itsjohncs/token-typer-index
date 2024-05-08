import util from "node:util";

import {buildIndex} from "../src/index.js";
import { createQueryPlan, executeQueryPlan } from "token-typer-index-searcher";

function print(thing: any): void {
    console.log(
        util.inspect(thing, { depth: null, colors: true, maxArrayLength: null }),
    );
}

async function main() {
    const index = await buildIndex();

    if (process.argv.length <= 1) {
        print(index);
    } else {
        const plan = createQueryPlan(index.tags, process.argv.slice(1).join(" "));
        print(plan);
        
        const matched = executeQueryPlan(plan, index.assets);
        print(matched);
    }
}

await main();
