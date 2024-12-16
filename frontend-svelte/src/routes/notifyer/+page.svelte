<script lang="ts">
	import { z } from 'zod';
	import Input from '@/components/ui/input/input.svelte';
	import MultiSelect from './multi-select.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Label from '@/components/ui/label/label.svelte';

	// Define validation schema
	const notificationSchema = z.object({
		title: z
			.string()
			.min(1, 'Title is required')
			.max(100, 'Title must be less than 100 characters'),
		body: z
			.string()
			.min(1, 'Message is required')
			.max(500, 'Message must be less than 500 characters'),
		selectedUsers: z
			.array(
				z.object({
					value: z.string(),
					label: z.string()
				})
			)
			.min(1, 'Please select at least one recipient')
	});

	type NotificationSchema = z.infer<typeof notificationSchema>;

	let { data } = $props();

	// Define form data
	let formData: NotificationSchema = $state({
		title: '',
		body: '',
		selectedUsers: []
	});

	// Define users
	const users = $derived(
		data.users.map((user) => ({
			value: String(user.id),
			label: user.name
		}))
	);

	// Define errors
	let errors = $state({
		title: '',
		body: '',
		selectedUsers: ''
	});

	let isLoading = $state(false);

	let hasSubmitted = $state(false);

	// Check if the form has been submitted, and if it has, check if it is valid
	$effect(() => {
		if (hasSubmitted) {
			const result = notificationSchema.safeParse(formData);

			if (!result.success) {
				// Reset all errors first
				errors.title = '';
				errors.body = '';
				errors.selectedUsers = '';

				// Map Zod errors to our error state
				result.error.errors.forEach((error) => {
					const path = error.path[0] as keyof typeof errors;
					errors[path] = error.message;
				});
			} else {
				// Clear all errors if the form becomes valid
				errors.title = '';
				errors.body = '';
				errors.selectedUsers = '';
			}
		}
	});

	// Handle the form submission
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		hasSubmitted = true;

		const result = notificationSchema.safeParse(formData);
		if (!result.success) {
			return;
		}

		isLoading = true;

		try {
			await fetch('/svelte/api/notify', {
				method: 'POST',
				body: JSON.stringify({
					title: formData.title,
					body: formData.body,
					users: formData.selectedUsers.map((user) => Number(user.value))
				})
			});

			formData.title = '';
			formData.body = '';
			formData.selectedUsers = [];

			hasSubmitted = false;
		} catch (error) {
			console.error('Failed to send notification:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex flex-col justify-between gap-6 sm:flex-row">
		<div>
			<h2 class="mb-1 text-xl font-semibold">Notifyer</h2>
			<p class="text-muted-foreground text-sm">
				Notifyer is a tool that allows you to send notifications to users.
			</p>
		</div>
	</div>
	<form onsubmit={handleSubmit} class="flex flex-col gap-4">
		<div class="space-y-2">
			<Label for="title">Notification Title</Label>
			<Input
				id="title"
				name="title"
				bind:value={formData.title}
				placeholder="Enter notification title"
				class={hasSubmitted && errors.title ? 'border-red-500' : ''}
			/>
			{#if hasSubmitted && errors.title}
				<p class="mt-1 text-sm text-red-500">{errors.title}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="body">Notification Message</Label>
			<Input
				id="body"
				name="body"
				bind:value={formData.body}
				placeholder="Enter notification message"
				class={hasSubmitted && errors.body ? 'border-red-500' : ''}
			/>
			{#if hasSubmitted && errors.body}
				<p class="mt-1 text-sm text-red-500">{errors.body}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label>Select Recipients</Label>
			<MultiSelect
				error={hasSubmitted && !!errors.selectedUsers}
				options={users}
				bind:selected={formData.selectedUsers}
			/>
			{#if hasSubmitted && errors.selectedUsers}
				<p class="mt-1 text-sm text-red-500">{errors.selectedUsers}</p>
			{/if}
		</div>

		<Button type="submit" class="mt-8 w-full" disabled={isLoading}>
			{#if isLoading}
				Sending...
			{:else}
				Send Notification
			{/if}
		</Button>
	</form>
</div>
