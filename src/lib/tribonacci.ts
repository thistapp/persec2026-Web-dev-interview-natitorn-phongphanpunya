/**
 * Returns the first `n` elements of a Tribonacci sequence, where each new
 * element is the sum of the previous three.
 *
 * tribonacci([1, 3, 5], 5) -> [1, 3, 5, 9, 17]
 *
 * - `signature` holds 0 to 3 starting integers. With fewer than 3, each new
 *   element is the sum of the (up to three) elements before it, which is the
 *   same as padding the start with zeros: [1] -> 1, 1, 2, 4, 7, ...
 *   An empty signature gives all zeros.
 * - If `n` is smaller than the signature, the signature is cut to `n` elements.
 * - The input array is not changed.
 *
 * Throws a RangeError for a bad signature or `n`, or when a value grows past
 * Number.MAX_SAFE_INTEGER (it could no longer be stored exactly).
 */
export function tribonacci(signature: readonly number[], n: number): number[] {
	if (signature.length > 3) {
		throw new RangeError(
			`Signature must have 0 to 3 numbers, got ${signature.length}`,
		);
	}
	for (const x of signature) {
		if (!Number.isSafeInteger(x)) {
			throw new RangeError(`Signature must contain only integers, got ${x}`);
		}
	}
	if (!Number.isSafeInteger(n) || n < 0) {
		throw new RangeError(`n must be a non-negative integer, got ${n}`);
	}

	const result = signature.slice(0, n);
	for (let i = result.length; i < n; i++) {
		// Missing earlier elements count as 0 (`?? 0`).
		const next =
			(result[i - 1] ?? 0) + (result[i - 2] ?? 0) + (result[i - 3] ?? 0);
		if (!Number.isSafeInteger(next)) {
			throw new RangeError(
				`Element ${i + 1} is too large to store exactly (past ${Number.MAX_SAFE_INTEGER})`,
			);
		}
		result.push(next);
	}
	return result;
}
