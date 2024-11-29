<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Button from '@/components/ui/button/button.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from './schema';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onSubmit: async ({ formData }) => {
			const something = await signIn('credentials', {
				email: formData.get('email'),
				password: formData.get('password')
			});

			console.log(something);
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" use:enhance class="mx-auto max-w-md">
	{#if $message}
		<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
			{$message.text}
		</div>
	{/if}

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

	<Button type="submit">Hello</Button>
</form>
