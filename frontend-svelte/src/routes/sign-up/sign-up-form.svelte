<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { tick } from 'svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select/index.js';
	import { type Location } from '$lib/types';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';
	import { useId } from 'bits-ui';
	import Check from 'lucide-svelte/icons/check';

	let { locations, data }: { locations: Location[]; data: SuperValidated<Infer<FormSchema>> } =
		$props();

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	let open = $state(false);
	let value = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const triggerId = useId();
</script>

<form method="POST" use:enhance class="mx-auto max-w-md">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="c_password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm Password</Form.Label>
				<Input {...props} bind:value={$formData.c_password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="location_id" class="flex flex-col">
		<Popover.Root bind:open>
			<Form.Control id={triggerId}>
				{#snippet children({ props })}
					<Form.Label>Language</Form.Label>
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[200px] justify-between',
							!$formData.location_id && 'text-muted-foreground'
						)}
						role="combobox"
						{...props}
					>
						{locations.find((f) => String(f.id) === $formData.location_id)?.name ??
							'Select location'}
						<ChevronsUpDown class="opacity-50" />
					</Popover.Trigger>
					<input hidden value={$formData.location_id} name={props.name} />
				{/snippet}
			</Form.Control>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input autofocus placeholder="Search location..." class="h-9" />
					<Command.Empty>No locations found.</Command.Empty>
					<Command.Group>
						{#each locations as location}
							<Command.Item
								value={location.name}
								onSelect={() => {
									$formData.location_id = String(location.id);
									closeAndFocusTrigger();
								}}
							>
								{location.name}
								<Check
									class={cn(
										'ml-auto',
										String(location.id) !== $formData.location_id && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit">Hello</Button>
</form>
