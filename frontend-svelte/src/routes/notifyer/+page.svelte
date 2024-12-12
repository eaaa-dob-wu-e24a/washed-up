<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import MultiSelect from './multi-select.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Label from '@/components/ui/label/label.svelte';

	let { data } = $props();

	let formData: {
		title: string;
		body: string;
		selectedUsers: { value: string; label: string }[];
	} = $state({
		title: '',
		body: '',
		selectedUsers: []
	});

	const users = $derived(
		data.users.map((user) => ({
			value: String(user.id),
			label: user.name
		}))
	);

	let errors = $state({
		title: '',
		body: '',
		selectedUsers: ''
	});

	let isLoading = $state(false);

	let hasSubmitted = $state(false);

	function validateTitle(title: string): string {
		if (!title.trim()) return 'Title is required';
		if (title.length > 100) return 'Title must be less than 100 characters';
		return '';
	}

	function validateBody(body: string): string {
		if (!body.trim()) return 'Message is required';
		if (body.length > 500) return 'Message must be less than 500 characters';
		return '';
	}

	function validateUsers(users: any[]): string {
		return users.length === 0 ? 'Please select at least one recipient' : '';
	}

	function validateForm(): boolean {
		errors.title = validateTitle(formData.title);
		errors.body = validateBody(formData.body);
		errors.selectedUsers = validateUsers(formData.selectedUsers);

		return !errors.title && !errors.body && !errors.selectedUsers;
	}

	$effect(() => {
		errors.title = validateTitle(formData.title);
	});

	$effect(() => {
		errors.body = validateBody(formData.body);
	});

	$effect(() => {
		errors.selectedUsers = validateUsers(formData.selectedUsers);
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		hasSubmitted = true;

		if (!validateForm()) {
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/svelte/api/notify', {
				method: 'POST',
				body: JSON.stringify({
					title: formData.title,
					body: formData.body,
					users: formData.selectedUsers.map((user) => Number(user.value))
				})
			});

			const responseData = await response.json();
			console.log(responseData);

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
