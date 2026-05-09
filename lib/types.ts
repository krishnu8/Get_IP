export interface Visitor {
  id: string;
  ip_address: string;
  visited_at: string;
}

export interface VisitorLocation {
  id: string;
  visitor_id: string;
  ip_address: string;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  permission_status: string;
  created_at: string;
}

/** Combined view for admin dashboard */
export interface VisitorWithLocation extends Visitor {
  visitor_locations?: VisitorLocation[];
}

export interface VisitorsResponse {
  visitors: Visitor[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
