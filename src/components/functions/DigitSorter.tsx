"use client";

import {useState} from "react";
import {sortDigitsDesc} from "@/lib/sortDigitsDesc";

const EXAMPLES = [3008, 1989, 2679, 9163];

const inputClass =
	"mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100";

// Returns the sorted result, or an error message to show instead.
function convert(text: string): {value?: string; error?: string} {
	const t = text.trim();
	if (t === "") return {};
	if (!/^\d+$/.test(t))
		return {error: "Enter digits only (a positive whole number)."};
	// BigInt keeps long numbers exact; a normal number would round after 15-16 digits.
	const n = BigInt(t);
	if (n === BigInt(0)) return {error: "Enter a number greater than 0."};
	return {value: sortDigitsDesc(n).toString()};
}

export default function DigitSorter() {
	const [input, setInput] = useState("3008");
	const {value, error} = convert(input);

	return (
		<div className='w-full space-y-4 text-left'>
			<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
				Positive integer
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					inputMode='numeric'
					spellCheck={false}
					placeholder='e.g. 3008'
					className={inputClass}
				/>
			</label>

			<div className='flex flex-wrap gap-2'>
				{EXAMPLES.map((n) => (
					<button
						key={n}
						type='button'
						onClick={() => setInput(String(n))}
						className='rounded-md border border-black/10 px-2.5 py-1 font-mono text-sm text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-white/15 dark:text-zinc-300'
					>
						{n}
					</button>
				))}
			</div>

			<div aria-live='polite' className='text-sm'>
				{error ? (
					<p
						data-testid='digits-error'
						className='text-xs text-rose-700 dark:text-rose-400'
					>
						{error}
					</p>
				) : (
					value && (
						<p className='flex flex-wrap items-center gap-2'>
							<span className='font-mono text-zinc-500'>
								sortDigitsDesc({input.trim()})
							</span>
							<span className='text-zinc-500'>→</span>
							<span
								data-testid='digits-result'
								className='break-all font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400'
							>
								{value}
							</span>
						</p>
					)
				)}
			</div>
		</div>
	);
}
