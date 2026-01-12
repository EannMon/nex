// data.ts
import type { LatLngTuple } from "leaflet"; // FIXED: Added 'type' keyword

export interface ZoneData {
  id: string;
  name: string;
  type: "transport" | "traffic" | "risk";
  coords: LatLngTuple | LatLngTuple[];
  severity: "low" | "moderate" | "critical";
  details: {
    crowdCount?: number;
    waitTime?: string;
    riskType?: string;
    affected?: number;
  };
}

// MARIKINA CENTER BOUNDS
export const MARIKINA_BOUNDS: [LatLngTuple, LatLngTuple] = [
  [14.6000, 121.0500], // South-West
  [14.6800, 121.1500], // North-East
];

export const MOCK_ZONES: ZoneData[] = [
  {
    id: "c1",
    name: "Riverbanks Terminal",
    type: "transport",
    coords: [14.6305, 121.0880],
    severity: "critical",
    details: { crowdCount: 145, waitTime: "35 min", riskType: "Overcrowding" }
  },
  {
    id: "c2",
    name: "Concepcion Uno Market",
    type: "transport",
    coords: [14.6515, 121.1040],
    severity: "moderate",
    details: { crowdCount: 60, waitTime: "12 min", riskType: "Traffic Buildup" }
  },
  {
    id: "t1",
    name: "Marikina Bridge -> Bayan",
    type: "traffic",
    coords: [
      [14.6280, 121.0920],
      [14.6310, 121.0950],
      [14.6330, 121.0980]
    ],
    severity: "critical",
    details: { waitTime: "+45m delay", riskType: "Gridlock" }
  },
  {
    id: "r1",
    name: "Tumana Bridge Area",
    type: "risk",
    coords: [14.6580, 121.0950],
    severity: "critical",
    details: { riskType: "Flood Level Warning", affected: 300 }
  }
];