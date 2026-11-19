"use client";

import {useState} from "react";
import {isValidBrackets} from "@/lib/isValidBrackets";

const EXAMPLES = ["()", "([{}])", "([)]", "{"];

export default function BracketValidator() {
	const [input, setInput] = useState("([{}])");
	const result = isValidBrackets(input);
	// Only ( ) { } [ ] are allowed; flag anything else.
	const hasInvalidChars = /[^(){}[\]]/.test(input);

	return (
		<div className='w-full space-y-4 text-left'>
			<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
				Brackets
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					placeholder='e.g. ([{}])'
					className='mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100'
				/>
			</label>

			<div className='flex flex-wrap gap-2'>
				{EXAMPLES.map((ex) => (
					<button
						key={ex}
						type='button'
						onClick={() => setInput(ex)}
						className='rounded-md border border-black/10 px-2.5 py-1 font-mono text-sm text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-white/15 dark:text-zinc-300'
					>
						{ex}
					</button>
				))}
			</div>

			<div aria-live='polite' className='flex items-center gap-3 text-sm'>
				<span className='font-mono text-zinc-500'>
					isValidBrackets(&quot;{input}&quot;)
				</span>
				<span
					data-testid='bracket-result'
					className={`rounded-full px-3 py-1 font-mono font-semibold ${
						result
							? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
							: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
					}`}
				>
					{String(result)}
				</span>
			</div>
			{hasInvalidChars && (
				<p className='text-xs text-amber-700 dark:text-amber-400'>
					Only ( ) {"{ }"} [ ] are allowed, so any other character makes the
					result false.
				</p>
			)}
		</div>
	);
}
