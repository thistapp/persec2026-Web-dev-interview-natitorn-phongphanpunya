"use client";

import {useState} from "react";
import {autocomplete} from "@/lib/autocomplete";

const DEFAULT_ITEMS = "Mother, Think, Worthy, Apple, Android";

const inputClass =
	"mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const parse = (text: string) =>
	text
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

// Wraps the first case-insensitive match of `search` in <mark>.
function Highlight({text, search}: {text: string; search: string}) {
	const i = text.toLowerCase().indexOf(search.toLowerCase());
	if (i === -1 || search === "") return <>{text}</>;
	return (
		<>
			{text.slice(0, i)}
			<mark className='rounded-sm bg-indigo-200 text-inherit dark:bg-indigo-500/40'>
				{text.slice(i, i + search.length)}
			</mark>
			{text.slice(i + search.length)}
		</>
	);
}

export default function Autocomplete() {
	const [search, setSearch] = useState("th");
	const [itemsText, setItemsText] = useState(DEFAULT_ITEMS);
	const [maxResult, setMaxResult] = useState(2);

	const items = parse(itemsText);
	// Max results can never be more than the number of items. Clamping here (not
	// only in onChange) also lowers it when items are removed from the list.
	const effectiveMax = Math.min(Math.max(maxResult, 0), items.length);
	const results = autocomplete(search, items, effectiveMax);

	return (
		<div className='w-full space-y-4 text-left'>
			<div className='grid grid-cols-[1fr_6rem] gap-3'>
				<label className={labelClass}>
					Search
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						spellCheck={false}
						placeholder='e.g. th'
						className={inputClass}
					/>
				</label>
				<label className={labelClass}>
					Max results
					<input
						type='number'
						min={0}
						max={items.length}
						value={effectiveMax}
						onChange={(e) =>
							setMaxResult(
								Math.min(
									Math.max(Math.floor(Number(e.target.value)) || 0, 0),
									items.length,
								),
							)
						}
						className={inputClass}
					/>
					<span className='mt-1 block text-xs font-normal text-zinc-500'>
						of {items.length}
					</span>
				</label>
			</div>
			<label className={labelClass}>
				Items (comma-separated)
				<input
					value={itemsText}
					onChange={(e) => setItemsText(e.target.value)}
					spellCheck={false}
					className={inputClass}
				/>
			</label>

			<div aria-live='polite' className='space-y-1 text-sm'>
				<p className='font-mono text-zinc-500'>
					autocomplete(&quot;{search}&quot;, [{items.length} items],{" "}
					{effectiveMax})
				</p>
				{results.length === 0 ? (
					<p data-testid='autocomplete-empty' className='text-zinc-500'>
						No matches
					</p>
				) : (
					<ol
						data-testid='autocomplete-result'
						className='divide-y divide-black/5 overflow-hidden rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/15'
					>
						{results.map((item, i) => (
							<li
								key={`${item}-${i}`}
								className='px-3 py-1.5 font-mono text-zinc-800 dark:text-zinc-200'
							>
								<Highlight text={item} search={search} />
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}
