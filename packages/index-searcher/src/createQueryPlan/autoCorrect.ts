import {closest, distance} from "fastest-levenshtein";

/**
 * Spell checks and filters out unknown terms.
 */
export default function autoCorrect(
    queryTerms: string[],
    allPossibleTerms: string[],
): string[] {
    const result: string[] = [];
    for (const token of queryTerms) {
        const found = closest(token, allPossibleTerms);
        if (distance(found, token) <= 2) {
            result.push(found);
        }
    }
    return result;
}
