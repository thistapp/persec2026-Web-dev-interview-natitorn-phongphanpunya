const PAIRS: Record<string, string> = {
	")": "(",
	"}": "{",
	"]": "[",
};

/**
 * Returns true if every bracket in `s` is closed by the same type of bracket,
 * in the correct order. The input may contain only ( ) { } [ ].
 *
 * Uses a stack: push each opener, and on each closer check that it matches
 * the most recent unclosed opener. O(n) time, O(n) space.
 */
export function isValidBrackets(s: string): boolean {
	// An odd length can never be fully paired.
	if (s.length % 2 !== 0) return false;

	const stack: string[] = [];
	for (const ch of s) {
		if (ch === "(" || ch === "{" || ch === "[") {
			stack.push(ch);
		} else if (ch in PAIRS) {
			if (stack.pop() !== PAIRS[ch]) return false;
		} else {
			// Not a bracket: outside the allowed input.
			return false;
		}
	}
	return stack.length === 0;
}
