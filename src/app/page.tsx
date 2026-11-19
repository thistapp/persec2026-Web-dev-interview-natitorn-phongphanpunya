import FunctionSection from "@/components/FunctionSection";
import {sections} from "@/components/sections";
import BracketValidator from "@/components/functions/BracketValidator";
import NaturalSorter from "@/components/functions/NaturalSorter";
import Autocomplete from "@/components/functions/Autocomplete";
import RomanConverter, {
	SymbolInfo,
} from "@/components/functions/RomanConverter";
import DigitSorter from "@/components/functions/DigitSorter";
import TribonacciGenerator from "@/components/functions/TribonacciGenerator";
import type {ReactNode} from "react";

// Maps a section id to its working function UI. Sections without one show a placeholder.
const functionUIs: Record<string, ReactNode> = {
	"function-1": <BracketValidator />,
	"function-2": <NaturalSorter />,
	"function-3": <Autocomplete />,
	"function-4": <RomanConverter />,
	"function-5": <DigitSorter />,
	"function-6": <TribonacciGenerator />,
};

// Optional controls shown in a section's top-right corner.
const sectionActions: Record<string, ReactNode> = {
	"function-4": <SymbolInfo />,
};

export default function Home() {
	return (
		<div className='min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100'>
			<header className='sticky top-0 z-10 border-b border-black/10 bg-zinc-50/80 backdrop-blur dark:border-white/10 dark:bg-black/80'>
				<nav className='mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-4 sm:px-6'>
					<span className='shrink-0 font-bold'>Function Hub</span>
					<ul className='flex gap-4 text-sm'>
						{sections.map((s) => (
							<li key={s.id} className='shrink-0'>
								<a
									href={`#${s.id}`}
									className='text-zinc-600 hover:text-indigo-600 dark:text-zinc-400'
								>
									{s.title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</header>

			<main className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>
				<h1 className='text-3xl font-bold sm:text-4xl'>Function Hub</h1>
				<p className='mt-2 text-zinc-600 dark:text-zinc-400'>
					Six functions, one page.
				</p>

				<div className='mt-10 grid gap-6 md:grid-cols-2'>
					{sections.map((s) => (
						<FunctionSection key={s.id} {...s} action={sectionActions[s.id]}>
							{functionUIs[s.id]}
						</FunctionSection>
					))}
				</div>
			</main>
		</div>
	);
}
