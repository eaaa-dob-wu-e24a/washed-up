export type Machine = {
  id: number;
  type: string;
  location_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  location: {
    id: number;
    code: string;
    address: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
  };
};

export type Location = {
  id: number;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
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

export type Credits = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  amount: number;
};
