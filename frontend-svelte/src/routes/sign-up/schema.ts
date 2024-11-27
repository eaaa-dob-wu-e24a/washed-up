import { z } from 'zod';

export const formSchema = z
	.object({
		name: z.string().min(2).max(50),
		email: z.string().email(),
		password: z.string().min(8),
		c_password: z.string().min(8),
		location_id: z.string().min(1)
	})
	.refine((data) => data.password === data.c_password, {
		path: ['c_password'],
		message: 'Passwords do not match'
	});

export type FormSchema = typeof formSchema;
