<script lang="ts">
	import { Check, X } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { Badge } from '@/components/ui/badge';

	/** Options type */
	type Option = {
		value: string;
		label: string;
	};

	/** Component props */
	let {
		options,
		selected = $bindable([]),
		error = $bindable(false)
	}: { options: Option[]; selected: Option[]; error: boolean } = $props();

	/** Search input value */
	let searchValue: string = $state('');
	/** Show options dropdown */
	let isOpen: boolean = $state(false);

	/** Filtered options based on search */
	const filteredOptions = $derived(
		options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
	);

	/** Toggle option selection */
	const toggleOption = (option: Option) => {
		const index = selected.findIndex((item) => item.value === option.value);
		if (index === -1) {
			selected = [...selected, option];
		} else {
			selected = selected.filter((item) => item.value !== option.value);
		}
	};

	/** Remove selected option */
	const removeOption = (option: Option) => {
		selected = selected.filter((item) => item.value !== option.value);
	};

	/** Toggle all options */
	const toggleAll = () => {
		if (selected.length === options.length) {
			selected = [];
		} else {
			selected = [...options];
		}
	};
</script>

<!-- Select Container -->
<div class="relative">
	<!-- Selected Options and Search Input -->
	<div
		role="button"
		tabindex={0}
		class={cn(
			'border-input bg-background min-h-[42px] w-full rounded-md border px-3 py-2 text-sm',
			'ring-offset-background focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
			'flex flex-wrap gap-2',
			error && 'border-red-500'
		)}
		onclick={() => (isOpen = true)}
		onkeydown={(e) => e.key === 'Enter' && (isOpen = true)}
	>
		{#each selected as option}
			<div transition:slide>
				<Badge variant="secondary" class="gap-1">
					{option.label}
					<button
						type="button"
						class="hover:text-destructive"
						onclick={(e) => {
							e.stopPropagation();
							removeOption(option);
						}}
					>
						<X class="h-3 w-3" />
					</button>
				</Badge>
			</div>
		{/each}
		<input
			type="text"
			placeholder="Search..."
			class="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent outline-none"
			bind:value={searchValue}
		/>
	</div>

	<!-- Options Dropdown -->
	{#if isOpen}
		<div
			class="bg-popover text-popover-foreground absolute top-full z-50 mt-2 w-full rounded-md border shadow-md"
			transition:slide
		>
			<div class="p-1">
				<!-- Add Select All button -->
				<button
					type="button"
					class={cn(
						'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
						'hover:bg-accent hover:text-accent-foreground',
						'focus:bg-accent focus:text-accent-foreground'
					)}
					onclick={toggleAll}
				>
					<span class="flex-1"
						>{selected.length === options.length ? 'Deselect All' : 'Select All'}</span
					>
				</button>

				<!-- Separator -->
				<div class="bg-muted my-1 h-px"></div>

				{#if filteredOptions.length === 0}
					<p class="text-muted-foreground p-2 text-sm">No options found.</p>
				{:else}
					{#each filteredOptions as option}
						<button
							type="button"
							class={cn(
								'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
								'hover:bg-accent hover:text-accent-foreground',
								'focus:bg-accent focus:text-accent-foreground'
							)}
							onclick={() => toggleOption(option)}
						>
							<span class="flex-1">{option.label}</span>
							{#if selected.some((item) => item.value === option.value)}
								<Check class="h-4 w-4" />
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Click outside to close dropdown -->
{#if isOpen}
	<div
		role="button"
		tabindex={0}
		class="fixed inset-0 z-40"
		onclick={() => (isOpen = false)}
		onkeydown={(e) => e.key === 'Enter' && (isOpen = false)}
	></div>
{/if}
