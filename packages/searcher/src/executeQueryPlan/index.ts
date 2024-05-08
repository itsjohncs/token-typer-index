import Asset from "../Asset";
import QueryPlan from "../createQueryPlan/QueryPlan";

export default function executeQueryPlan<T extends Asset>(
    plan: QueryPlan,
    assets: T[],
): T[] {
    return assets.filter(function (asset) {
        const needed = new Set(plan.terms);
        for (const term of asset.tags) {
            needed.delete(term);
        }
        return needed.size === 0;
    });
}
