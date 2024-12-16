<script lang="ts">
	import SidebarLeft from '$lib/components/sidebar-left.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import '../app.css';
	import { page, navigating } from '$app/stores';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Loader2 } from 'lucide-svelte';
	let { children, data } = $props();

	const pathname = $derived($page.url.pathname);
	let breadcrumbs = $derived(pathname.split('/'));

	// Get the breadcrumb slug
	function getBreadcrumbSlug(path: string) {
		// get the full path and make sure to split it where the slug is equal to the path so you'll get the correct slug for every breadcrumb

		const beforeSlug = pathname.split(path)[0];

		return beforeSlug + path;
	}
</script>

{#if !data.session}
	{@render children()}
{:else}
	<Sidebar.Provider>
		<SidebarLeft session={data.session} />
		<Sidebar.Inset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="h-4 w-4" />
					<Separator orientation="vertical" class="h-4" />

					{#if $navigating}
						<Skeleton class="ml-3 h-4 w-24" />
					{:else}
						<Breadcrumb.Root>
							<Breadcrumb.List>
								{#each breadcrumbs as breadcrumb, index}
									<Breadcrumb.Item class="hidden capitalize md:block">
										<Breadcrumb.Link href={getBreadcrumbSlug(breadcrumb)}
											>{breadcrumb}</Breadcrumb.Link
										>
									</Breadcrumb.Item>
									{#if index < breadcrumbs.length - 1}
										<Breadcrumb.Separator class="hidden md:block" />
									{/if}
								{/each}
							</Breadcrumb.List>
						</Breadcrumb.Root>
					{/if}
				</div>
			</header>
			<main class="px-4">
				{#if $navigating}
					<div
						class="mx-auto flex h-[calc(100vh-64px)] max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8"
					>
						<Loader2 class="h-10 w-10 animate-spin" />
					</div>
				{:else}
					{@render children()}
				{/if}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
