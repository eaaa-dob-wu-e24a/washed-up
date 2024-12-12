export interface SignUpFormErrors {
  [key: string]: string;
}

export interface SignUpMetadata {
  [key: string]: any;
}

export interface UserInfoFormData {
  name: string;
  email: string;
  password: string;
  c_password: string;
}

export interface LocationFormData {
  location: string;
  locationCode: string;
}

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
  price_per_credit: string;
  currency: string;
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

export type CreditUsage = {
  id: number;
  user_id: number;
  machine_id: number;
  machine_type: string;
  duration_minutes: number;
  cost_credits: string;
  balance_after: string;
  created_at: string;
  updated_at: string;
  type: "purchase" | "refund";
};

export type CreditPurchase = {
  id: number;
  user_id: number;
  credits_bought: string;
  balance_after: string;
  price: string;
  currency: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
};
