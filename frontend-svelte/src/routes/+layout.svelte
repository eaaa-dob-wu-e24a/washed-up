<script lang="ts">
	import SidebarLeft from '$lib/components/sidebar-left.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import '../app.css';
	import { page } from '$app/stores';
	let { children, data } = $props();

	const pathname = $derived($page.url.pathname);

	let breadcrumbs = $derived(pathname.split('/'));
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
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#each breadcrumbs as breadcrumb, index}
								<Breadcrumb.Item class="hidden capitalize md:block">
									<Breadcrumb.Link href="#">{breadcrumb}</Breadcrumb.Link>
								</Breadcrumb.Item>
								{#if index < breadcrumbs.length - 1}
									<Breadcrumb.Separator class="hidden md:block" />
								{/if}
							{/each}
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
			</header>
			<main class="px-4">
				{@render children()}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
