import type {ReactNode} from "react";
import type {SectionInfo} from "./sections";

type Props = SectionInfo & {
	children?: ReactNode;
	// Optional control shown in the top-right corner of the section, e.g. an info button.
	action?: ReactNode;
};

export default function FunctionSection({
	id,
	number,
	title,
	description,
	children,
	action,
}: Props) {
	return (
		<section
			id={id}
			className='scroll-mt-20 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8'
		>
			<div className='flex items-start gap-4'>
				<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'>
					{number}
				</span>
				<div className='min-w-0 flex-1'>
					<h2 className='text-xl font-semibold'>{title}</h2>
					<p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
						{description}
					</p>
				</div>
				{action && <div className='shrink-0'>{action}</div>}
			</div>
			<div className='mt-6 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-black/15 p-4 text-sm text-zinc-500 dark:border-white/15'>
				{children ?? "Function content goes here"}
			</div>
		</section>
	);
}
