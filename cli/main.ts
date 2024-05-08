import util from "node:util";

import { buildIndex } from "token-typer-index-builder";
import {createQueryPlan, executeQueryPlan} from "token-typer-index-searcher";

function print(thing: any): void {
    console.log(
        util.inspect(thing, {depth: null, colors: true, maxArrayLength: null}),
    );
}

async function main() {
    const index = await buildIndex();

    const args = process.argv.slice(2);
    if (args.length === 0) {
        print(index);
    } else {
        const plan = createQueryPlan(index.tags, args.join(" "));
        print(plan);

        const matched = executeQueryPlan(plan, index.assets);
        print(matched);
    }
}

await main();
