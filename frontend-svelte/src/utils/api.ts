import { env } from '$env/dynamic/private';
import axios from 'axios';

export const api = axios.create({ baseURL: env.API_URL + '/api' });
