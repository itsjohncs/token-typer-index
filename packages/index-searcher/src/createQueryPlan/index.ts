import Tag from "../Tag";
import type QueryPlan from "./QueryPlan";
import autoCorrect from "./autoCorrect";

export default function createQueryPlan(tags: Tag[], query: string): QueryPlan {
    const allPossibleTerms = tags.flatMap((tag) => [
        ...tag.canonical,
        ...tag.aliases.map((alias) => alias.term),
    ]);
    return {
        terms: autoCorrect(query.split(" "), allPossibleTerms),
    };
}
