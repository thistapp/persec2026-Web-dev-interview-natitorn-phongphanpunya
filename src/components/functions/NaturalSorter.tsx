"use client";

import {useState} from "react";
import {naturalSort} from "@/lib/naturalSort";

const EXAMPLES = ["TH19, SG20, TH2", "TH10, TH3Netflix, TH1, TH7"];

// "a, b ,c" -> ["a", "b", "c"]; empty entries are dropped.
const parse = (text: string) =>
	text
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

function Chips({items, testId}: {items: string[]; testId: string}) {
	return (
		<ol data-testid={testId} className='flex flex-wrap gap-1.5'>
			{items.map((item, i) => (
				<li
					key={`${item}-${i}`}
					className='rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
				>
					{item}
				</li>
			))}
		</ol>
	);
}

export default function NaturalSorter() {
	const [input, setInput] = useState(EXAMPLES[0]);
	const items = parse(input);
	const natural = naturalSort(items);
	// Default JS sort compares character by character, so "TH19" lands before "TH2".
	const plain = [...items].sort();

	return (
		<div className='w-full space-y-4 text-left'>
			<label className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
				Strings (comma-separated)
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					spellCheck={false}
					placeholder='e.g. TH19, SG20, TH2'
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
						[{ex}]
					</button>
				))}
			</div>

			<div aria-live='polite' className='space-y-3 text-sm'>
				<div>
					<p className='mb-1 font-medium text-emerald-700 dark:text-emerald-400'>
						Natural sort
					</p>
					<Chips items={natural} testId='natural-result' />
				</div>
				<div>
					<p className='mb-1 text-zinc-500'>Plain .sort(), for comparison</p>
					<Chips items={plain} testId='plain-result' />
				</div>
			</div>
		</div>
	);
}
