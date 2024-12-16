<script lang="ts">
	import { page } from '$app/stores';

	// Get the error from the url
	const urlError = $derived($page.url.searchParams.get('error'));

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { signIn } from '@auth/sveltekit/client';
	import { z } from 'zod';

	export const formSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8)
	});

	let errors: Record<string, string[]> | undefined = $state({});
	let isSubmitted = $state(false);

	let form = $state({
		email: '',
		password: ''
	});

	// Handle the form submission
	function handleSubmit(event: Event) {
		event.preventDefault();

		// Parse the form data
		const result = formSchema.safeParse(form);

		// If the form is not valid, set the errors
		if (!result.success) {
			isSubmitted = true;
			errors = result.error.flatten().fieldErrors;
			return;
		}

		// Sign in with credentials using auth.js
		signIn('credentials', form);
	}

	// Check if the form has been submitted, and if it has, check if it is valid
	$effect(() => {
		if (isSubmitted) {
			const result = formSchema.safeParse(form);

			// If the form is not valid, set the errors
			if (!result.success) {
				errors = result.error.flatten().fieldErrors;
				return;
			}

			// If the form is valid, clear the errors
			errors = {};
		}
	});
</script>

<div class="flex h-screen w-full flex-col items-center justify-center px-4">
	{#if urlError}
		<div class="mx-auto mb-4 max-w-md rounded-md bg-red-50 p-4 text-red-700">
			Invalid credentials, please try again.
		</div>
	{/if}

	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleSubmit} class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="text"
						name="email"
						bind:value={form.email}
						placeholder="m@example.com"
					/>
					{#if errors?.email}
						<p class="text-destructive text-[0.8rem] font-medium">{errors.email[0]}</p>
					{/if}
				</div>

				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						bind:value={form.password}
						placeholder="Enter your password"
					/>
					{#if errors?.password}
						<p class="text-destructive text-[0.8rem] font-medium">{errors.password[0]}</p>
					{/if}
				</div>

				<Button type="submit" class="w-full">Login</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
