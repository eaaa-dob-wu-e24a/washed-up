export type Machine = {
  id: number;
  type: string;
  location_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  location: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

export type Location = {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
};
