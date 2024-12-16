<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, badgeVariants } from '@/components/ui/badge';
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '@/components/ui/card';
	import { cn } from '@/utils';
	import { getMachineStatus } from '@/utils/machine-status.js';
	import { Loader2, Power, Printer, Trash2 } from 'lucide-svelte';
	// @ts-ignore
	import QrCode from 'svelte-qrcode';

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

	// Handle the print action
	const handlePrint = (id: string) => {
		// Get the print content
		const printContent = document.getElementById(`${id}`);
		// Get the original body
		const originalBody = document.body.innerHTML;

		// Set the body to the print content
		document.body.innerHTML = printContent!.innerHTML;
		// Print the content
		window.print();
		// Reset the body to the original content
		document.body.innerHTML = originalBody;
	};

	let isLoading: boolean = $state(false);
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-8 flex items-start justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Machine Details</h1>
			<form
				method="POST"
				action={`?/toggle_status`}
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						isLoading = false;
						update();
					};
				}}
			>
				<input type="hidden" name="id" value={data?.machine?.id ?? ''} />
				<input type="hidden" name="status" value={data?.machine?.status === 1 ? 0 : 1} />

				<button
					class={cn(
						badgeVariants({ variant: getMachineStatus(data?.machine?.status ?? 0).variant }),
						'mt-4 py-2 text-sm'
					)}
					type="submit"
				>
					<Power class="mr-2" />
					{isLoading ? 'Updating...' : getMachineStatus(data?.machine?.status ?? 0).text}
				</button>
			</form>
		</div>

		<form
			class="flex items-start justify-start"
			use:enhance={() => {
				formLoading = {
					loading: true,
					id: data?.machine?.id ?? null
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
				disabled={formLoading.loading && formLoading.id === data?.machine?.id}
				variant="destructive"
				type="submit"
				size="icon"
			>
				{#if formLoading.loading && formLoading.id === data?.machine?.id}
					<Loader2 class="h-4 w-4 animate-spin" />
				{:else}
					<Trash2 class="h-4 w-4" />
				{/if}
			</Button>
			<input type="hidden" name="id" value={data?.machine?.id} />
		</form>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Basic Information -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Basic Information</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-3">
					<div class="flex">
						<span class="w-24 font-medium text-gray-600">ID:</span>
						<span class="text-gray-800">{data?.machine?.id}</span>
					</div>
					<div class="flex">
						<span class="w-24 font-medium text-gray-600">Type:</span>
						<span class="capitalize text-gray-800">{data?.machine?.type}</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Location -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Location</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-3">
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Address:</span>
						<span class="text-gray-800">{data?.machine?.location.address}</span>
					</div>
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Coordinates:</span>
						<span class="text-gray-800">
							{data?.machine?.location.latitude}, {data?.machine?.location.longitude}
						</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Timestamps -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Timestamps</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-3">
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Created:</span>
						<span class="text-gray-800">{formatDate(data?.machine?.created_at ?? '')}</span>
					</div>
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Last Updated:</span>
						<span class="text-gray-800">{formatDate(data?.machine?.updated_at ?? '')}</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>
					<div class="flex items-center justify-between">
						<span>QR Code</span>

						<Button
							size="icon"
							variant="outline"
							onclick={() => handlePrint('printable-qr-machine')}
						>
							<Printer class="h-4 w-4" />
						</Button>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div>
					<div class="flex flex-col items-center">
						<div id="printable-qr-machine">
							<div class="flex flex-col items-center p-4">
								<QrCode value={data?.machine?.qr_code.code} />
								<span class="mt-4 text-xl font-medium text-gray-800"
									>{data?.machine?.qr_code.code}</span
								>
							</div>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
