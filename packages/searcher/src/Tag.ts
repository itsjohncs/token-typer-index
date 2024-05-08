export default interface Tag {
    /**
     * Unique identifiers for tag.
     *
     * Any of these can be used to perfectly identify a tag. We allow multiple
     * to make it easier to reference tags when indexing.
     */
    canonical: string[];

    /**
     * Non-unique aliases for tag.
     */
    aliases: {
        /**
         * Search term. May contain spaces.
         */
        term: string;

        /**
         * Relevancy of alias within range (0, 1].
         *
         * 1 is extremely relevant.
         */
        weight: number;
    }[];
}
