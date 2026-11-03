export type PurchaseResponseSchema = {
  id: string,
  amount: number,
  price: number,
  purchase_date: string,
  unit_price: number,
  unit_of_measurement: string,
  user_id: string | null,
  user_name: string | null,
  supply_id: string,
  supply_name: string,
  created_at: string,
  status: string,
  confirmed_at: string | null,
  confirmed_by: string | null,
};

export type PurchaseListResponseSchema = {
  items: PurchaseResponseSchema[],
  cursor: string | null,
  next_cursor: string | null,
  total: number,
  has_next: boolean,
};
