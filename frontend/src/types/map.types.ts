export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  type?: "delivery" | "depot" | "vehicle";
}

export interface RoutePolyline {
  path: { lat: number; lng: number }[];
  color?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
