export interface Visitor {
  id: string;
  ip_address: string;
  visited_at: string;
}

export interface VisitorsResponse {
  visitors: Visitor[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
