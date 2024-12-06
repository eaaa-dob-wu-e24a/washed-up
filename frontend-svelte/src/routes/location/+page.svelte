<script lang="ts">
	import type { PageData } from './$types';
	import { Badge } from '@/components/ui/badge';
	import * as Card from '@/components/ui/card';
	import { Printer } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	// @ts-ignore
	import QrCode from 'svelte-qrcode';
	import { onMount } from 'svelte';

	let { data } = $props();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	let map: any;

	onMount(() => {
		// Initialize the map after component mounts
		//@ts-ignore
		const L = window.L;
		map = L.map('map').setView([data?.location?.latitude, data?.location?.longitude], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Add a marker
		L.marker([data?.location?.latitude, data?.location?.longitude])
			.addTo(map)
			.bindPopup(data?.location?.address);
	});

	const handlePrint = (id: string) => {
		const printContent = document.getElementById(`${id}`);
		const originalBody = document.body.innerHTML;

		document.body.innerHTML = printContent!.innerHTML;
		window.print();
		document.body.innerHTML = originalBody;
	};
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</svelte:head>

<div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
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
	:global(.leaflet-container) {
		z-index: 0;
	}
</style>
