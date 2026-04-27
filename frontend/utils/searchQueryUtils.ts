export interface ParsedSearchQuery {
    freeText: string;
    filters: Record<string, string>;
}

const KNOWN_FIELDS = new Set(['priority']);

export function parseSearchQuery(input: string): ParsedSearchQuery {
    const filters: Record<string, string> = {};
    const freeTextTokens: string[] = [];

    for (const token of input.split(/\s+/).filter(Boolean)) {
        const colonIdx = token.indexOf(':');
        if (colonIdx > 0) {
            const field = token.slice(0, colonIdx).toLowerCase();
            const value = token.slice(colonIdx + 1);
            if (KNOWN_FIELDS.has(field) && value.length > 0) {
                filters[field] = value.toLowerCase();
                continue;
            }
        }
        freeTextTokens.push(token);
    }

    return { freeText: freeTextTokens.join(' '), filters };
}

export function matchesPriorityFilter(
    itemPriority: string | number | null | undefined,
    filterValue: string
): boolean {
    if (filterValue === 'none') {
        return itemPriority === null || itemPriority === undefined;
    }
    const normalized =
        typeof itemPriority === 'number'
            ? ['low', 'medium', 'high'][itemPriority]
            : itemPriority;
    return (normalized ?? '').toLowerCase() === filterValue;
}
