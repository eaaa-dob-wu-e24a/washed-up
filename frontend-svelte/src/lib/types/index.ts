export type Location = {
	id: number;
	code: string;
	address: string;
	latitude: string;
	longitude: string;
	created_at: string;
	updated_at: string;
};

export type Machine = {
	id: number;
	type: 'wash' | 'dry';
	location_id: number;
	status: number;
	created_at: string;
	updated_at: string;
	location: Location;
};

export type MenuItems = {
	title: string;
	url: string;
	// this should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: any;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};
