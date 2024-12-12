export type Location = {
	id: number;
	code: string;
	address: string;
	latitude: string;
	longitude: string;
	created_at: string;
	updated_at: string;
	price_per_credit: number;
	currency: string;
};

export type Machine = {
	id: number;
	type: string;
	location_id: number;
	status: number;
	created_at: string;
	updated_at: string;
	location: Location;
	qr_code: {
		id: number;
		machine_id: number;
		code: string;
		created_at: string;
		updated_at: string;
	};
};

export type Schedule = {
	id: number;
	user_id: number;
	machine_id: number;
	start_time: string;
	end_time: string;
	created_at: string;
	updated_at: string;
};

export type MenuItems = {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

export type User = {
	id: number;
	name: string;
	email: string;
	email_verified_at: string;
	role: string;
	created_at: string;
	updated_at: string;
	location_id: number;
};

export type NotifyableUser = {
	id: number;
	name: string;
	email: string;
	role: string;
};

export type ExtendedUser = User & {
	credits: {
		id: number;
		created_at: string;
		updated_at: string;
		user_id: number;
		amount: number;
	};
	schedules: Schedule[];
};

export type Stats = {
	machine_stats: {
		total_machines: number;
		washing_machines: string;
		dryers: string;
		active_machines: string;
		inactive_machines: string;
	};
	usage_stats: {
		total_bookings: number;
		unique_users: number;
		avg_duration_minutes: string;
		total_minutes_used: string;
	};
	revenue_stats: {
		date: string;
		total_credits_spent: string;
		unique_paying_users: string;
		avg_transaction_value: string;
	}[];
	refund_stats: {
		date: string;
		total_credits_refunded: string;
		unique_refunded_users: string;
		avg_refund_value: string;
	}[];
	peak_hours: {
		hour: string;
		booking_count: string;
	}[];
	machine_performance: {
		id: number;
		type: string;
		total_bookings: number;
		total_revenue: string;
		avg_usage_time: string;
	}[];
};
