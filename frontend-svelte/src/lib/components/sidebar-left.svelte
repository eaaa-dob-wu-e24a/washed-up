<script lang="ts" module>
	import WashingMachine from 'lucide-svelte/icons/washing-machine';
	import Calendar from 'lucide-svelte/icons/calendar';
	import LineChart from 'lucide-svelte/icons/line-chart';
	import Users from 'lucide-svelte/icons/users';

	// This is sample data.
	const data: {
		navMain: MenuItems[];
	} = {
		navMain: [
			{
				title: 'Machines',
				url: '/machines',
				icon: WashingMachine
			},
			{
				title: 'Rentals',
				url: '/rentals',
				icon: Calendar
			},
			{
				title: 'Report',
				url: '/report',
				icon: LineChart
			},
			{
				title: 'Users',
				url: '/users',
				icon: Users
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { Session } from '@auth/sveltekit';
	import type { Location, MenuItems } from '@/types';

	let {
		session,
		location,
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: {
		session: Session;
		location: Location;
		ref?: any;
		collapsible?: string;
	} & ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<NavUser
			user={{
				email: session.user.email || '',
				name: session.user.name || '',
				avatar: session.user.image || ''
			}}
		/>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
