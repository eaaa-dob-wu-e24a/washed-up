<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '@/components/ui/button/button.svelte';
	import { getMachineStatus } from '@/utils/machine-status.js';
	import { Loader2, Trash2 } from 'lucide-svelte';

	let { data } = $props();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	let formLoading: {
		loading: boolean;
		id: number | null;
	} = $state({
		loading: false,
		id: null
	});
</script>

<div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
	<div class="mb-8 flex items-start justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Machine Details</h1>
			<span
				class={`${getMachineStatus(data.machine.status).class} rounded-full px-4 py-1 text-sm font-semibold text-white`}
			>
				{getMachineStatus(data.machine.status).text}
			</span>
		</div>

		<form
			class="flex items-start justify-start"
			use:enhance={() => {
				formLoading = {
					loading: true,
					id: data.machine.id
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
				disabled={formLoading.loading && formLoading.id === data.machine.id}
				variant="destructive"
				type="submit"
				size="icon"
			>
				{#if formLoading.loading && formLoading.id === data.machine.id}
					<Loader2 class="h-4 w-4 animate-spin" />
				{:else}
					<Trash2 class="h-4 w-4" />
				{/if}
			</Button>
			<input type="hidden" name="id" value={data.machine.id} />
		</form>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Basic Information -->
		<div class="rounded-lg border bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Basic Information</h2>
			<div class="space-y-3">
				<div class="flex">
					<span class="w-24 font-medium text-gray-600">ID:</span>
					<span class="text-gray-800">{data.machine.id}</span>
				</div>
				<div class="flex">
					<span class="w-24 font-medium text-gray-600">Type:</span>
					<span class="capitalize text-gray-800">{data.machine.type}</span>
				</div>
			</div>
		</div>

		<!-- Location -->
		<div class="rounded-lg border bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Location</h2>
			<div class="space-y-3">
				<div class="flex">
					<span class="w-24 font-medium text-gray-600">Code:</span>
					<span class="text-gray-800">{data.machine.location.code}</span>
				</div>
				<div class="flex flex-col">
					<span class="mb-1 font-medium text-gray-600">Address:</span>
					<span class="text-gray-800">{data.machine.location.address}</span>
				</div>
				<div class="flex flex-col">
					<span class="mb-1 font-medium text-gray-600">Coordinates:</span>
					<span class="text-gray-800">
						{data.machine.location.latitude}, {data.machine.location.longitude}
					</span>
				</div>
			</div>
		</div>

		<!-- Timestamps -->
		<div class="rounded-lg border bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Timestamps</h2>
			<div class="space-y-3">
				<div class="flex flex-col">
					<span class="mb-1 font-medium text-gray-600">Created:</span>
					<span class="text-gray-800">{formatDate(data.machine.created_at)}</span>
				</div>
				<div class="flex flex-col">
					<span class="mb-1 font-medium text-gray-600">Last Updated:</span>
					<span class="text-gray-800">{formatDate(data.machine.updated_at)}</span>
				</div>
			</div>
		</div>
	</div>
</div>
