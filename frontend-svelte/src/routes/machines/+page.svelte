<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import CreateMachineForm, { createMachineSchema } from '@/components/create-machine-form.svelte';
	import { Badge } from '@/components/ui/badge';
	import { buttonVariants } from '@/components/ui/button';
	import Button from '@/components/ui/button/button.svelte';
	import type { Machine } from '@/types';
	import { cn } from '@/utils';
	import { getMachineStatus } from '@/utils/machine-status';
	import { Loader2, Plus, Trash2 } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	let {
		data
	}: { data: { machines: Machine[]; form: SuperValidated<Infer<typeof createMachineSchema>> } } =
		$props();
	let open = $state(false);
	let formLoading: {
		loading: boolean;
		id: number | null;
	} = $state({
		loading: false,
		id: null
	});

	// Toggle the dialog
	function toggleDialog() {
		open = !open;
	}
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex flex-col justify-between gap-6 sm:flex-row">
		<div>
			<h2 class="mb-1 text-xl font-semibold">Machines</h2>
			<p class="text-muted-foreground text-sm">
				Machines are the core of your business. They are used to process orders and generate
				revenue.
			</p>
		</div>

		<Dialog.Root {open} onOpenChange={(v) => (open = v)}>
			<Dialog.Trigger class="h-max">
				<Button>Add Machine <Plus class="ml-2 h-4 w-4" /></Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add Machine</Dialog.Title>
					<Dialog.Description>
						Add a new machine to your business. This will allow you to process orders and generate
						revenue.
					</Dialog.Description>
				</Dialog.Header>

				<CreateMachineForm {toggleDialog} data={data.form} />
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.machines as machine}
			<Card.Root>
				<Card.Header class="flex flex-row items-start justify-between space-y-0">
					<div class="flex flex-col gap-1">
						<Card.Title class="capitalize">{machine.type}</Card.Title>
						<Card.Description>
							<Badge variant={getMachineStatus(machine.status).variant} class="my-2 p-2">
								{getMachineStatus(machine.status).text}
							</Badge>
						</Card.Description>
					</div>
					<form
						class="flex items-start justify-start"
						use:enhance={() => {
							formLoading = {
								loading: true,
								id: machine.id
							};
							return async ({ update }) => {
								formLoading = {
									loading: false,
									id: null
								};
								update();
							};
						}}
						method="POST"
						action={`?/delete_machine`}
					>
						<Button
							disabled={formLoading.loading && formLoading.id === machine.id}
							variant="destructive"
							type="submit"
							size="icon"
						>
							{#if formLoading.loading && formLoading.id === machine.id}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								<Trash2 class="h-4 w-4" />
							{/if}
						</Button>
						<input type="hidden" name="id" value={machine.id} />
					</form>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-2">
						<p class="text-sm">ID: #{machine.id}</p>

						<a href={`/machines/${machine.id}`} class={cn(buttonVariants())}>View Machine</a>
						<!-- Add more machine details based on your Machine type -->
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
