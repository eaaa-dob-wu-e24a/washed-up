export type Machine = {
  id: number;
  model: string;
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
