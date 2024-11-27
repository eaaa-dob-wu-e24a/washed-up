<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from "$lib/components/ui/select/index.js";

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
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

	<Form.Field {form} name="email">
		<Form.Control>
		  {#snippet children({ props })}
			<Form.Label>Location</Form.Label>
			<Select.Root
			  type="single"
			  bind:value={$formData.location_id}
			  name={props.name}
			>
			  <Select.Trigger {...props}>
				{$formData.email
				  ? $formData.email
				  : "Select a verified email to display"}
			  </Select.Trigger>
			  <Select.Content>
				<Select.Item value="m@example.com" label="m@example.com" />
				<Select.Item value="m@google.com" label="m@google.com" />
				<Select.Item value="m@support.com" label="m@support.com" />
			  </Select.Content>
			</Select.Root>
		  {/snippet}
		</Form.Control>
		<Form.Description>
		  You can manage email address in your <a href="/examples/forms"
			>email settings</a
		  >.
		</Form.Description>
		<Form.FieldErrors />
	  </Form.Field>

	<Button type="submit">Hello</Button>
</form>
