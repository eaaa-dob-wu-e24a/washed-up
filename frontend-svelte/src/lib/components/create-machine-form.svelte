<script module>
	import { z } from 'zod';

	// Validation schema for the create machine form
	export const createMachineSchema = z.object({
		type: z
			.string({ required_error: 'Please select a machine type' })
			.min(1, 'Please select a machine type')
	});
</script>

<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from './ui/button/button.svelte';
	import { Loader2 } from 'lucide-svelte';

	function getLabel(type: string) {
		return type === 'wash' ? 'Washer' : 'Dryer';
	}

	let {
		toggleDialog,
		data
	}: { toggleDialog: () => void; data: SuperValidated<Infer<typeof createMachineSchema>> } =
		$props();

	// Create a superForm instance with the data and validation schema
	const form = superForm(data, {
		validators: zodClient(createMachineSchema),

		// Handle the result of the form submission
		onResult: ({ result }) => {
			if (result.status === 200) {
				formLoading = true;
				toggleDialog();
			} else {
				formLoading = false;
			}
		},
		onSubmit: () => {
			formLoading = true;
		}
	});

	let formLoading = $state(false);

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/create_machine" class="space-y-6" use:enhance>
	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Type</Form.Label>
				<Select.Root type="single" bind:value={$formData.type} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.type ? getLabel($formData.type) : 'Select a machine type'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="wash" label="Washer" />
						<Select.Item value="dry" label="Dryer" />
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>
			You can manage machine types in your <a href="/machines">machine settings</a>.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Button disabled={formLoading} type="submit">
		{#if formLoading}
			<Loader2 class="h-4 w-4 animate-spin" />
		{:else}
			Submit
		{/if}
	</Button>
</form>
