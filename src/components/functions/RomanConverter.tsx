"use client";

import {useEffect, useId, useRef, useState} from "react";
import {
	MAX_ROMAN,
	MIN_ROMAN,
	ROMAN_SYMBOLS,
	intToRoman,
	romanToInt,
} from "@/lib/romanNumerals";

const EXAMPLES = [1989, 2000, 68, 109];

const inputClass =
	"mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-mono text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-100";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

// Runs a conversion and turns a thrown error into a message for the page.
function tryConvert<T>(fn: () => T): {value?: T; error?: string} {
	try {
		return {value: fn()};
	} catch (e) {
		return {error: (e as Error).message};
	}
}

function Result({
	testId,
	value,
	error,
}: {
	testId: string;
	value?: string | number;
	error?: string;
}) {
	return error ? (
		<p
			data-testid={`${testId}-error`}
			className='mt-1.5 text-xs text-rose-700 dark:text-rose-400'
		>
			{error}
		</p>
	) : (
		<p className='mt-1.5 text-sm'>
			<span className='text-zinc-500'>= </span>
			<span
				data-testid={testId}
				className='font-mono font-semibold text-emerald-700 dark:text-emerald-400'
			>
				{value}
			</span>
		</p>
	);
}

// Round "i" button that shows the Roman symbol table in a popover.
// - Mouse: opens on hover, closes when the pointer leaves the icon and table.
// - Touch (mobile): opens on tap, closes on a second tap or a tap outside.
// - Keyboard: Enter/Space toggles it. Escape always closes it.
export function SymbolInfo() {
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	// Pointer type of the last press, so a mouse click doesn't undo the hover.
	const lastPointer = useRef<string>("");
	const popoverId = useId();

	const cancelClose = () => clearTimeout(closeTimer.current);
	// Short delay so the pointer can move from the icon onto the table.
	const scheduleClose = () => {
		cancelClose();
		closeTimer.current = setTimeout(() => setOpen(false), 120);
	};
	useEffect(() => cancelClose, []);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
				buttonRef.current?.focus();
			}
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	return (
		<div
			ref={wrapperRef}
			className='relative'
			onPointerEnter={(e) => {
				if (e.pointerType !== "mouse") return;
				cancelClose();
				setOpen(true);
			}}
			onPointerLeave={(e) => {
				if (e.pointerType === "mouse") scheduleClose();
			}}
		>
			<button
				ref={buttonRef}
				type='button'
				aria-label='Roman symbols'
				aria-expanded={open}
				aria-controls={popoverId}
				onPointerDown={(e) => {
					lastPointer.current = e.pointerType;
				}}
				onClick={() => {
					const pointer = lastPointer.current;
					lastPointer.current = "";
					// Hover already handles the mouse; touch and keyboard toggle.
					if (pointer !== "mouse") setOpen((o) => !o);
				}}
				className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-300 font-serif text-base font-bold italic leading-none text-zinc-800 shadow-sm outline-none hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-500 aria-expanded:bg-zinc-100 dark:border-zinc-900 dark:bg-zinc-400 dark:hover:bg-zinc-300'
			>
				i
			</button>

			{open && (
				<div
					id={popoverId}
					role='dialog'
					aria-label='Roman symbols'
					className='absolute top-full right-0 z-20 w-48 pt-2'
				>
					<div className='rounded-lg border border-black/10 bg-white p-2 shadow-lg dark:border-white/15 dark:bg-zinc-900'>
						<table className='w-full text-sm'>
							<caption className='mb-1 text-left text-xs text-zinc-500'>
								Roman symbols
							</caption>
							<thead className='bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'>
								<tr>
									<th scope='col' className='px-3 py-1.5 text-left font-medium'>
										Symbol
									</th>
									<th
										scope='col'
										className='px-3 py-1.5 text-right font-medium'
									>
										Value
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-black/5 dark:divide-white/10'>
								{ROMAN_SYMBOLS.map(({symbol, value}) => (
									<tr key={symbol}>
										<td className='px-3 py-1 font-mono font-semibold text-zinc-800 dark:text-zinc-200'>
											{symbol}
										</td>
										<td className='px-3 py-1 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300'>
											{value.toLocaleString("en-US")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

export default function RomanConverter() {
	const [numText, setNumText] = useState("1989");
	const [roman, setRoman] = useState("MCMLXXXIX");

	const toRoman = tryConvert(() =>
		numText.trim() === "" ? "" : intToRoman(Number(numText)),
	);
	const toInt = tryConvert(() =>
		roman.trim() === "" ? "" : romanToInt(roman.trim()),
	);

	return (
		<div className='w-full space-y-4 text-left'>
			<div className='grid gap-4 sm:grid-cols-2'>
				<div>
					<label className={labelClass}>
						Number → Roman
						<input
							type='number'
							min={MIN_ROMAN}
							max={MAX_ROMAN}
							value={numText}
							onChange={(e) => setNumText(e.target.value)}
							placeholder='1 – 3999'
							className={inputClass}
						/>
					</label>
					<Result testId='to-roman' {...toRoman} />
				</div>
				<div>
					<label className={labelClass}>
						Roman → Number
						<input
							value={roman}
							onChange={(e) => setRoman(e.target.value)}
							spellCheck={false}
							autoCapitalize='characters'
							placeholder='e.g. MCMLXXXIX'
							className={`${inputClass} uppercase`}
						/>
					</label>
					<Result testId='to-int' {...toInt} />
				</div>
			</div>

			<div className='flex flex-wrap gap-2'>
				{EXAMPLES.map((n) => {
					const r = intToRoman(n);
					return (
						<button
							key={n}
							type='button'
							onClick={() => {
								setNumText(String(n));
								setRoman(r);
							}}
							className='rounded-md border border-black/10 px-2.5 py-1 font-mono text-sm text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-white/15 dark:text-zinc-300'
						>
							{n} ↔ {r}
						</button>
					);
				})}
			</div>
		</div>
	);
}
