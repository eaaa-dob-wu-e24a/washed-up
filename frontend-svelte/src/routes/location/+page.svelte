<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '@/components/ui/card';
	import { Printer } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import maplibregl from 'maplibre-gl';
	// @ts-ignore
	import QrCode from 'svelte-qrcode';
	import * as Select from '@/components/ui/select';
	import { Input } from '@/components/ui/input';

	let { data } = $props();

	// Format the date string to a readable format
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	let map: maplibregl.Map;

	// Initialize the map
	$effect(() => {
		map = new maplibregl.Map({
			container: 'map',
			style: 'https://api.maptiler.com/maps/streets/style.json?key=sbfEucYQxAyackK4Fnbi', // free key from maptiler
			center: [Number(data?.location?.longitude), Number(data?.location?.latitude)],
			zoom: 13
		});

		// Add marker
		new maplibregl.Marker()
			.setLngLat([Number(data?.location?.longitude), Number(data?.location?.latitude)])
			.setPopup(new maplibregl.Popup().setHTML(data?.location?.address || ''))
			.addTo(map);
	});

	// Handle the print action
	const handlePrint = (id: string) => {
		const printContent = document.getElementById(`${id}`);
		const originalBody = document.body.innerHTML;

		document.body.innerHTML = printContent!.innerHTML;
		window.print();
		document.body.innerHTML = originalBody;
	};

	let price = $state(data?.location?.price_per_credit || 0);
	let currency = $state(data?.location?.currency || 'EUR');

	const currencies = [
		{ value: 'EUR', label: 'Euro (EUR)' },
		{ value: 'GBP', label: 'British Pound (GBP)' },
		{ value: 'DKK', label: 'Danish Krone (DKK)' },
		{ value: 'SEK', label: 'Swedish Krona (SEK)' },
		{ value: 'NOK', label: 'Norwegian Krone (NOK)' }
	];

	const triggerContent = $derived(
		currencies.find((c) => c.value === currency)?.label ?? 'Select a currency'
	);
</script>

<svelte:head>
	{#if browser}
		<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
	{/if}
</svelte:head>

<div class="mx-auto max-w-7xl pb-12">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Location Details</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Basic Information -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Basic Information</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-3">
					<div class="flex">
						<span class="w-24 font-medium text-gray-600">ID:</span>
						<span class="text-gray-800">{data?.location?.id}</span>
					</div>
					<div class="flex">
						<span class="w-24 font-medium text-gray-600">Code:</span>
						<span class="text-gray-800">{data?.location?.code}</span>
					</div>
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Address:</span>
						<span class="text-gray-800">{data?.location?.address}</span>
					</div>
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Coordinates:</span>
						<span class="text-gray-800"
							>{data?.location?.latitude}, {data?.location?.longitude}</span
						>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- QR Code -->
		<Card.Root>
			<Card.Header>
				<Card.Title>
					<div class="flex items-center justify-between">
						<span>QR Code</span>
						<Button size="icon" variant="outline" onclick={() => handlePrint('printable-qr')}>
							<Printer class="h-4 w-4" />
						</Button>
					</div>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col items-center">
					<div id="printable-qr">
						<div class="flex flex-col items-center p-4">
							<QrCode value={data?.location?.code} />
							<span class="mt-4 text-xl font-medium text-gray-800">{data?.location?.code}</span>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Map -->
		<Card.Root class="md:col-span-2">
			<Card.Header>
				<Card.Title>Map</Card.Title>
			</Card.Header>
			<Card.Content>
				<div id="map" class="h-[400px] w-full rounded-lg"></div>
			</Card.Content>
		</Card.Root>

		<!-- Pricing Settings -->
		<Card.Root class="md:col-span-2">
			<Card.Header>
				<Card.Title>Pricing Settings</Card.Title>
			</Card.Header>
			<Card.Content>
				<form class="space-y-4" method="POST" action="?/update_pricing">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="space-y-2">
							<label for="price" class="text-sm font-medium text-gray-700">Price per Credit</label>
							<Input
								type="number"
								id="price"
								name="pricePerCredit"
								bind:value={price}
								step="0.01"
								min="0"
							/>
						</div>
						<div class="space-y-2">
							<label for="currency" class="text-sm font-medium text-gray-700">Currency</label>
							<Select.Root type="single" name="currency" bind:value={currency}>
								<Select.Trigger>
									{triggerContent}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each currencies as curr}
											<Select.Item value={curr.value} label={curr.label}>
												{curr.label}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
					</div>
					<div class="flex justify-end">
						<Button type="submit">Update Pricing</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<!-- Timestamps -->
		<Card.Root class="md:col-span-2">
			<Card.Header>
				<Card.Title>Timestamps</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Created:</span>
						<span class="text-gray-800">{formatDate(data?.location?.created_at || '')}</span>
					</div>
					<div class="flex flex-col">
						<span class="mb-1 font-medium text-gray-600">Last Updated:</span>
						<span class="text-gray-800">{formatDate(data?.location?.updated_at || '')}</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

<style>
	/* Remove the leaflet-specific style */
</style>
