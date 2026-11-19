// Lower rank = better match.
const enum Rank {
	Start = 0, // "th" in "Think"
	Middle = 1, // "th" in "Mother"
	End = 2, // "th" in "Smith"
}

type Match = {item: string; rank: Rank; position: number; order: number};

/**
 * Case-insensitive search for `search` inside each item. Returns up to
 * `maxResult` matching items, best first:
 *   1. items that start with `search`
 *   2. items that contain `search` in the middle
 *   3. items that end with `search`
 * Within a group, an earlier match position wins, then the original order.
 * Each item is ranked by its first (earliest) occurrence of `search`.
 *
 * An empty `search` or a `maxResult` of 0 or less returns [].
 *
 * autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2)
 *   -> ["Think", "Mother"]
 */
export function autocomplete(
	search: string,
	items: readonly string[],
	maxResult: number,
): string[] {
	const limit = Math.floor(maxResult);
	if (search === "" || !(limit > 0)) return [];

	const needle = search.toLowerCase();
	const matches: Match[] = [];

	items.forEach((item, order) => {
		const position = item.toLowerCase().indexOf(needle);
		if (position === -1) return;

		let rank: Rank;
		if (position === 0) rank = Rank.Start;
		else if (position + needle.length === item.length) rank = Rank.End;
		else rank = Rank.Middle;

		matches.push({item, rank, position, order});
	});

	return matches
		.sort(
			(a, b) => a.rank - b.rank || a.position - b.position || a.order - b.order,
		)
		.slice(0, limit)
		.map((m) => m.item);
}
