<script lang="ts">
	import type { Machine } from '@/types';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';
	import CreateMachineForm, { createMachineSchema } from '@/components/create-machine-form.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	let {
		data
	}: { data: { machines: Machine[]; form: SuperValidated<Infer<typeof createMachineSchema>> } } =
		$props();
	let open = $state(false);

	function toggleDialog() {
		open = !open;
	}
</script>

<div class="mb-6 flex justify-between gap-6">
	<div>
		<h2 class="mb-1 text-xl font-semibold">Machines</h2>
		<p class="text-muted-foreground text-sm">
			Machines are the core of your business. They are used to process orders and generate revenue.
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
		<a href={`/machines/${machine.id}`}>
			<Card.Root>
				<Card.Header>
					<Card.Title class="capitalize">{machine.type}</Card.Title>
					<Card.Description>Status: {machine.status}</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<p class="text-sm">ID: #{machine.id}</p>
						<!-- Add more machine details based on your Machine type -->
					</div>
				</Card.Content>
			</Card.Root>
		</a>
	{/each}
</div>
