"use client";

import {useId, useState} from "react";
import {tribonacci} from "@/lib/tribonacci";

const EXAMPLES: [number[], number][] = [
	[[1, 3, 5], 5],
	[[2, 2, 2], 3],
	[[10, 10, 10], 4],
];

// Keeps the list on the page readable. The function itself has no such limit.
const MAX_N_ON_PAGE = 100;

const inputClass =
	"mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

// "1, 3, 5" -> [1, 3, 5]; "" -> []. Returns an error for anything that isn't a whole number.
function parseSignature(text: string): {values?: number[]; error?: string} {
	const parts = text
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	if (parts.some((p) => !/^-?\d+$/.test(p))) {
		return {error: "Signature must be whole numbers separated by commas."};
	}
	return {values: parts.map(Number)};
}

function run(sigText: string, n: number): {values?: number[]; error?: string} {
	const sig = parseSignature(sigText);
	if (sig.error) return sig;
	try {
		return {values: tribonacci(sig.values!, n)};
	} catch (e) {
		return {error: (e as Error).message};
	}
}

export default function TribonacciGenerator() {
	const [sigText, setSigText] = useState("1, 3, 5");
	const [n, setN] = useState(5);
	const nHintId = useId();
	const {values, error} = run(sigText, n);
	const sigLength = parseSignature(sigText).values?.length ?? 0;

	return (
		<div className='w-full space-y-4 text-left'>
			<div className='grid grid-cols-[1fr_6rem] gap-3'>
				<label className={labelClass}>
					Signature (0 to 3 numbers)
					<input
						value={sigText}
						onChange={(e) => setSigText(e.target.value)}
						spellCheck={false}
						placeholder='e.g. 1, 3, 5'
						className={inputClass}
					/>
				</label>
				<div>
					<label className={labelClass}>
						n
						<input
							type='number'
							min={0}
							max={MAX_N_ON_PAGE}
							value={n}
							onChange={(e) =>
								setN(
									Math.min(
										Math.max(Math.floor(Number(e.target.value)) || 0, 0),
										MAX_N_ON_PAGE,
									),
								)
							}
							aria-describedby={nHintId}
							className={inputClass}
						/>
					</label>
					<p id={nHintId} className='mt-1 text-xs text-zinc-500'>
						max {MAX_N_ON_PAGE}
					</p>
				</div>
			</div>

			<div className='flex flex-wrap gap-2'>
				{EXAMPLES.map(([sig, count]) => (
					<button
						key={sig.join()}
						type='button'
						onClick={() => {
							setSigText(sig.join(", "));
							setN(count);
						}}
						className='rounded-md border border-black/10 px-2.5 py-1 font-mono text-sm text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-white/15 dark:text-zinc-300'
					>
						f([{sig.join(", ")}], {count})
					</button>
				))}
			</div>

			<div aria-live='polite' className='text-sm'>
				{error ? (
					<p
						data-testid='tribonacci-error'
						className='text-xs text-rose-700 dark:text-rose-400'
					>
						{error}
					</p>
				) : values!.length === 0 ? (
					<p data-testid='tribonacci-empty' className='font-mono text-zinc-500'>
						[] (empty)
					</p>
				) : (
					<ol
						data-testid='tribonacci-result'
						className='flex flex-wrap gap-1.5'
					>
						{values!.map((v, i) => (
							<li
								key={i}
								title={
									i < sigLength
										? "From the signature"
										: "Sum of the previous three"
								}
								className={`rounded-md px-2 py-0.5 font-mono text-sm tabular-nums ${
									i < sigLength
										? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
										: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
								}`}
							>
								{v}
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}
