<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import { cn } from '$lib/utils.js';
	import type { Stats } from '@/types';
	import { getDateRanges } from '@/utils/get-date-ranges';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { localStore } from '../../store/index.svelte';
	import { Loader2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Chart, Svg, Axis, Spline, Highlight, Tooltip, Grid } from 'layerchart';
	import { scaleTime, scaleLinear } from 'd3-scale';
	import { formatDate, PeriodType } from '@layerstack/utils';
	import { format } from 'date-fns';

	const df = new DateFormatter('da-DK', {
		dateStyle: 'medium'
	});

	const currentDate = new Date();
	const today = new CalendarDate(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		currentDate.getDate()
	);

	let ranges = localStore('report', {
		start: today.subtract({ days: 7 }),
		end: today
	});

	let date_ranges = $state({
		start: new CalendarDate(
			ranges.value.start.year,
			ranges.value.start.month,
			ranges.value.start.day
		),
		end: new CalendarDate(ranges.value.end.year, ranges.value.end.month, ranges.value.end.day)
	});

	$effect(() => {
		if (!date_ranges?.start || !date_ranges?.end) return;
		ranges.value = {
			start: new CalendarDate(
				date_ranges.start.year,
				date_ranges.start.month,
				date_ranges.start.day
			),
			end: new CalendarDate(date_ranges.end.year, date_ranges.end.month, date_ranges.end.day)
		};
	});

	let open = $state(false);

	let data: Stats | null = $state(null);

	let revenueData: {
		date: Date;
		value: number;
		users: number;
		avg_transaction: number;
	}[] = $state([]);

	let peakHoursData: {
		hour: number;
		value: number;
	}[] = $state([]);

	let loading = $state(true);

	let revenueRefundData: {
		date: Date;
		revenue: number;
		refunds: number;
	}[] = $state([]);

	let refundData: {
		date: Date;
		credits: number;
		users: number;
	}[] = $state([]);

	async function getStats() {
		if (!date_ranges?.start || !date_ranges?.end) return;
		const dateRanges = getDateRanges(
			date_ranges?.start.toDate('Europe/Copenhagen'),
			date_ranges?.end.toDate('Europe/Copenhagen')
		);

		// Fetch the stats from api route located in src/routes/svelte/api/stats/+server.ts
		const res = await fetch(`/svelte/api/stats?start=${dateRanges.start}&end=${dateRanges.end}`);
		const data = await res.json();
		return data;
	}

	// Every time the date ranges change, fetch the stats, and update the data
	$effect(() => {
		if (open) return;
		loading = true;
		getStats().then((report) => {
			data = report;
			loading = false;
		});
	});

	// Prepare chart data when stats are loaded
	$effect(() => {
		if (!data) return;

		// Format revenue data for chart with users
		revenueData = data.revenue_stats.map((day) => ({
			date: new Date(day.date),
			value: parseFloat(day.total_credits_spent),
			users: parseInt(day.unique_paying_users),
			avg_transaction: parseFloat(day.avg_transaction_value)
		}));

		// Format peak hours data
		peakHoursData = data.peak_hours.map((hour) => ({
			hour: parseInt(hour.hour),
			value: parseInt(hour.booking_count)
		}));

		// Prepare combined revenue and refund data
		revenueRefundData = data.revenue_stats.map((day, index) => ({
			date: new Date(day.date),
			revenue: parseFloat(day.total_credits_spent),
			refunds: parseFloat(data?.refund_stats[index]?.total_credits_refunded ?? '0')
		}));

		// Prepare refund data
		refundData = data.refund_stats.map((day) => ({
			date: new Date(day.date),
			credits: parseFloat(day.total_credits_refunded),
			users: parseInt(day.unique_refunded_users)
		}));
	});
</script>

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex flex-col justify-between gap-6 sm:flex-row">
		<div>
			<h2 class="mb-1 text-xl font-semibold">Statistics</h2>
			<p class="text-muted-foreground text-sm">
				Statistics is a tool that allows you to generate statistics.
			</p>
		</div>
		<Popover.Root {open} onOpenChange={(v) => (open = v)}>
			<Popover.Trigger
				class={cn(
					buttonVariants({ variant: 'outline' }),
					!date_ranges?.start && !date_ranges?.end && 'text-muted-foreground'
				)}
			>
				<CalendarIcon class="mr-2 size-4" />
				{#if date_ranges?.start && date_ranges?.end}
					{#if date_ranges?.end}
						{df.format(date_ranges?.start?.toDate(getLocalTimeZone()))} - {df.format(
							date_ranges?.end?.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(date_ranges?.start?.toDate(getLocalTimeZone()))}
					{/if}
				{:else}
					Pick a date
				{/if}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<RangeCalendar
					bind:value={date_ranges}
					onStartValueChange={(v) => {
						if (v) {
							// @ts-ignore
							date_ranges.start = v;
						}
					}}
					onEndValueChange={(v) => {
						if (v) {
							// @ts-ignore
							date_ranges.end = v;
						}
					}}
					numberOfMonths={2}
					maxValue={today}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>

	{#if loading}
		<div class="flex h-[calc(100vh-200px)] items-center justify-center">
			<Loader2 class="h-6 w-6 animate-spin" />
		</div>
	{/if}

	{#if data}
		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Machine Stats Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Machine Statistics</Card.Title>
					<Card.Description>Overview of machine status</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<div class="flex justify-between">
							<span>Total Machines</span>
							<span class="font-semibold">{data.machine_stats.total_machines}</span>
						</div>
						<div class="flex justify-between">
							<span>Active Machines</span>
							<span class="font-semibold">{data.machine_stats.active_machines}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
			<!-- Usage Stats Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Usage Statistics</Card.Title>
					<Card.Description>Booking and user activity</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<div class="flex justify-between">
							<span>Total Bookings</span>
							<span class="font-semibold">{data.usage_stats.total_bookings}</span>
						</div>
						<div class="flex justify-between">
							<span>Unique Users</span>
							<span class="font-semibold">{data.usage_stats.unique_users}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Revenue Chart Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Revenue Over Time</Card.Title>
					<Card.Description>Daily revenue trends</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[230px]">
						<Chart
							data={revenueData}
							x="date"
							xScale={scaleTime()}
							y="value"
							yDomain={[0, null]}
							yNice
							y1="users"
							y1Scale={scaleLinear()}
							y1Range={({ yScale }) => yScale.domain()}
							padding={{ top: 24, bottom: 24, left: 24, right: 24 }}
							tooltip={{ mode: 'bisect-x' }}
							let:height
							let:y1Scale
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="right"
									scale={scaleLinear(y1Scale?.domain() ?? [], [height, 0])}
									rule
								/>
								<Axis
									placement="bottom"
									format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
									ticks={revenueData.map((d) => d.date).length > 7
										? 7
										: revenueData.map((d) => d.date).length}
									rule
								/>
								<Spline class="stroke-primary stroke-2" />
								<Spline y={(d) => y1Scale?.(d.users)} class="stroke-destructive stroke-2" />
								<Highlight lines points />
								<Highlight
									points={{ class: 'fill-muted-foreground' }}
									y={(d) => y1Scale?.(d.users)}
								/>
								<Grid y class="stroke-black/5" />
							</Svg>

							<Tooltip.Root class="bg-background rounded-md border" let:data>
								<Tooltip.Header>{format(data.date, 'eee, MMMM do')}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Revenue"
										value={`${data.value} credits`}
										class="text-primary"
									/>
									<Tooltip.Item label="Unique Users" value={data.users} class="text-destructive" />
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Average Transaction Value Chart Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Average Transaction Value</Card.Title>
					<Card.Description>Daily average credits spent per transaction</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[230px]">
						<Chart
							data={revenueData}
							x="date"
							xScale={scaleTime()}
							y="avg_transaction"
							yDomain={[0, null]}
							yNice
							padding={{ top: 24, bottom: 24, left: 24, right: 24 }}
							tooltip={{ mode: 'bisect-x' }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
									ticks={revenueData.map((d) => d.date).length > 7
										? 7
										: revenueData.map((d) => d.date).length}
									rule
								/>
								<Spline class="stroke-primary stroke-2" />
								<Highlight lines points />
								<Grid y class="stroke-black/5" />
							</Svg>

							<Tooltip.Root class="bg-background rounded-md border" let:data>
								<Tooltip.Header>{format(data.date, 'eee, MMMM do')}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Avg Transaction"
										value={`${data.avg_transaction.toFixed(2)} credits`}
										class="text-primary"
									/>
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Peak Hours Chart Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Peak Hours</Card.Title>
					<Card.Description>Booking distribution throughout the day</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[230px]">
						<Chart
							data={peakHoursData}
							x="hour"
							y="value"
							yDomain={[0, null]}
							yNice
							padding={{ top: 24, bottom: 24, left: 24, right: 24 }}
							tooltip={{ mode: 'bisect-x' }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis placement="bottom" rule />
								<Spline class="stroke-primary stroke-2" />
								<Highlight points lines />
								<Grid y class="stroke-black/5" />
							</Svg>

							<Tooltip.Root class="bg-background rounded-md border" let:data>
								<Tooltip.Header>Hour {data.hour}:00</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item label="Bookings" value={data.value} />
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Revenue vs Refunds Chart Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Revenue vs Refunds</Card.Title>
					<Card.Description>Daily revenue and refund comparison</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[230px]">
						<Chart
							data={revenueRefundData}
							x="date"
							xScale={scaleTime()}
							y="revenue"
							yDomain={[0, null]}
							yNice
							padding={{ top: 24, bottom: 24, left: 24, right: 24 }}
							tooltip={{ mode: 'bisect-x' }}
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="bottom"
									format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
									rule
									ticks={revenueRefundData.map((d) => d.date).length > 7
										? 7
										: revenueRefundData.map((d) => d.date).length}
								/>
								<Spline class="stroke-primary stroke-2" />
								<Spline y="refunds" class="stroke-destructive stroke-2" />
								<Highlight lines points />
								<Highlight points={{ class: 'fill-destructive' }} y="refunds" />
								<Grid y class="stroke-black/5" />
							</Svg>

							<Tooltip.Root class="bg-background rounded-md border" let:data>
								<Tooltip.Header>{format(data.date, 'eee, MMMM do')}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Revenue"
										value={`${data.revenue} credits`}
										class="text-primary"
									/>
									<Tooltip.Item
										label="Refunds"
										value={`${data.refunds} credits`}
										class="text-destructive"
									/>
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Refund Analysis Chart Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Refund Analysis</Card.Title>
					<Card.Description>Daily refund amounts and affected users</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[230px]">
						<Chart
							data={refundData}
							x="date"
							y="credits"
							xScale={scaleTime()}
							yDomain={[0, null]}
							yNice
							y1="users"
							y1Scale={scaleLinear()}
							y1Range={({ yScale }) => yScale.domain()}
							padding={{ top: 24, bottom: 24, left: 24, right: 24 }}
							tooltip={{ mode: 'bisect-x' }}
							let:height
							let:y1Scale
						>
							<Svg>
								<Axis placement="left" grid rule />
								<Axis
									placement="right"
									scale={scaleLinear(y1Scale?.domain() ?? [], [height, 0])}
									rule
								/>
								<Axis
									placement="bottom"
									format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
									rule
									ticks={refundData.map((d) => d.date).length > 7
										? 7
										: refundData.map((d) => d.date).length}
								/>
								<Spline class="stroke-destructive stroke-2" />
								<Spline y={(d) => y1Scale?.(d.users)} class="stroke-muted-foreground stroke-2" />
								<Highlight lines points />
								<Highlight
									points={{ class: 'fill-muted-foreground' }}
									y={(d) => y1Scale?.(d.users)}
								/>
								<Grid y class="stroke-black/5" />
							</Svg>

							<Tooltip.Root class="bg-background rounded-md border" let:data>
								<Tooltip.Header>{format(data.date, 'eee, MMMM do')}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Credits Refunded"
										value={`${data.credits} credits`}
										class="text-destructive"
									/>
									<Tooltip.Item
										label="Unique Users"
										value={data.users}
										class="text-muted-foreground"
									/>
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
