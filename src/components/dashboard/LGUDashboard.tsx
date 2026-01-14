import { useState, useEffect } from "react";
import { 
    MapContainer, TileLayer, Circle, Polyline, Tooltip, 
    ZoomControl, useMapEvents 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
    Activity, Users, Navigation, Clock, Loader2,
    Info, AlertTriangle, AlertOctagon
} from "lucide-react";

// --- 1. CONFIGURATION ---
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; 
const CITY_NAME = "Marikina,PH";

const MARIKINA_BOUNDS: L.LatLngBoundsExpression = [
    [14.6050, 121.0750], 
    [14.6750, 121.1450]
];

// --- CSS FOR MAP STYLING (Responsive Tooltips + Glow) ---
const MAP_STYLES = `
  /* Selected Item Glow */
  .map-selected {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
    transition: all 0.3s ease;
    z-index: 1000 !important;
  }

  /* Responsive Glass Tooltip Container */
  .leaflet-tooltip.glass-tooltip {
    background: rgba(255, 255, 255, 0.90);
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 6px;
    padding: 2px 6px !important; /* Compact padding for mobile */
    white-space: nowrap;
  }

  /* Remove the default Leaflet triangle pointer to save space */
  .leaflet-tooltip-top:before, 
  .leaflet-tooltip-bottom:before, 
  .leaflet-tooltip-left:before, 
  .leaflet-tooltip-right:before {
    border: none !important; 
  }

  /* Desktop Scaling: Increase padding slightly on larger screens */
  @media (min-width: 768px) {
    .leaflet-tooltip.glass-tooltip {
        padding: 4px 8px !important;
    }
  }
`;

// --- 2. DATA SETS ---
const segmentConfigs = [
    { id: "SH-1", name: "Sumulong (Riverbanks)", color: "#ef4444", status: "Gridlock", count: "5 kph", points: [[14.6295, 121.0880], [14.6335, 121.0955]] },
    { id: "SH-2", name: "Sumulong (Bayan)", color: "#f59e0b", status: "Heavy", count: "20 kph", points: [[14.6335, 121.0955], [14.6355, 121.1030]] },
    { id: "SH-3", name: "Sumulong (Masinag Bound)", color: "#22c55e", status: "Flowing", count: "40 kph", points: [[14.6355, 121.1030], [14.6390, 121.1150]] },
    { id: "MH-1", name: "Marcos Hwy (Bridge)", color: "#ef4444", status: "Gridlock", count: "10 kph", points: [[14.6215, 121.0830], [14.6232, 121.1000]] },
    { id: "MH-2", name: "Marcos Hwy (Eastbound)", color: "#f59e0b", status: "Slowing", count: "25 kph", points: [[14.6232, 121.1000], [14.6250, 121.1250]] },
    { id: "JP-1", name: "J.P. Rizal (Kalumpang)", color: "#22c55e", status: "Clear", count: "35 kph", points: [[14.6200, 121.0920], [14.6290, 121.0950]] },
    { id: "JP-2", name: "J.P. Rizal (Bridge Underpass)", color: "#ef4444", status: "Congested", count: "8 kph", points: [[14.6290, 121.0950], [14.6360, 121.0965]] },
    { id: "JP-3", name: "J.P. Rizal (Nangka Bound)", color: "#f59e0b", status: "Moderate", count: "22 kph", points: [[14.6360, 121.0965], [14.6550, 121.1050]] },
    { id: "GF-1", name: "Gil Fernando (South)", color: "#22c55e", status: "Flowing", count: "45 kph", points: [[14.6232, 121.1000], [14.6348, 121.1008]] },
    { id: "GF-2", name: "Gil Fernando (North)", color: "#f59e0b", status: "Slowing", count: "20 kph", points: [[14.6348, 121.1008], [14.6450, 121.1030]] },
    { id: "SA-1", name: "Shoe Avenue", color: "#f59e0b", status: "Moderate", count: "18 kph", points: [[14.6335, 121.0965], [14.6465, 121.1015]] },
    { id: "GO-1", name: "Gen. Ordoñez St.", color: "#22c55e", status: "Clear", count: "30 kph", points: [[14.6370, 121.1090], [14.6520, 121.1180]] },
    { id: "LILAC", name: "Lilac Street", color: "#ef4444", status: "Heavy/Parking", count: "12 kph", points: [[14.6390, 121.1150], [14.6450, 121.1300]] },
    { id: "BAYAN-BAYANAN", name: "Bayan-bayanan Ave", color: "#f59e0b", status: "Moderate", count: "15 kph", points: [[14.6515, 121.1040], [14.6400, 121.1080]] },
    { id: "FORTUNE", name: "Fortune Ave", color: "#22c55e", status: "Moving", count: "25 kph", points: [[14.6610, 121.1150], [14.6720, 121.1250]] }
];

const marikinaHeatmaps = [
    { id: 1, name: "Marikina Bayan", lat: 14.6335, lng: 121.0955, count: 520, wait: 45, radius: 675, action: "Dispatch Traffic Enforcers" },
    { id: 2, name: "Riverbanks Center", lat: 14.6300, lng: 121.0880, count: 410, wait: 35, radius: 525, action: "Monitor Queue Length" },
    { id: 3, name: "Barangka Flyover", lat: 14.6285, lng: 121.0825, count: 440, wait: 40, radius: 600, action: "Check Merging Lane" },
    { id: 4, name: "LRT-2 Santolan Station", lat: 14.6220, lng: 121.0850, count: 480, wait: 32, radius: 480, action: "Coord with LRTA" },
    { id: 5, name: "Concepcion Uno", lat: 14.6515, lng: 121.1040, count: 390, wait: 28, radius: 420, action: "Clear Market Entrance" },
    { id: 6, name: "SM Marikina Area", lat: 14.6250, lng: 121.0910, count: 310, wait: 25, radius: 375, action: "Monitor Mall Traffic" },
    { id: 7, name: "Marcos Hwy - Gil Fernando", lat: 14.6232, lng: 121.1000, count: 350, wait: 22, radius: 330, action: "Adjust Signal Timing" },
    { id: 8, name: "Tumana Bridge Access", lat: 14.6480, lng: 121.0995, count: 210, wait: 18, radius: 270, action: "Flood Watch Required" },
    { id: 9, name: "Parang-Fortune Jct", lat: 14.6610, lng: 121.1150, count: 220, wait: 15, radius: 225, action: "School Zone Alert" },
    { id: 10, name: "Kalumpang (J.P. Rizal)", lat: 14.6200, lng: 121.0920, count: 190, wait: 14, radius: 210, action: "No Action Needed" },
    { id: 11, name: "Marikina Heights (NGI)", lat: 14.6465, lng: 121.1120, count: 250, wait: 12, radius: 180, action: "Monitor Tricycle Terminal" },
    { id: 12, name: "Concepcion Dos (Lilac St)", lat: 14.6390, lng: 121.1150, count: 180, wait: 9, radius: 135, action: "Check Illegal Parking" },
    { id: 13, name: "Fortune Barangay Hall", lat: 14.6680, lng: 121.1230, count: 140, wait: 7, radius: 105, action: "No Action Needed" },
    { id: 14, name: "SSS Village (Panorama)", lat: 14.6360, lng: 121.1250, count: 130, wait: 5, radius: 75, action: "No Action Needed" }
];

const peakRiskZones = [
    { id: "P1", name: "Marcos Hwy Bridge", lat: 14.6218, lng: 121.0865, impact: "Extreme Bottleneck", time: "5PM - 8PM", color: "#7c3aed" },
    { id: "P2", name: "Sumulong Bayan Cross", lat: 14.6335, lng: 121.0955, impact: "Pedestrian Surge", time: "7AM - 9AM", color: "#f59e0b" },
    { id: "P3", name: "Tumana Bridge North", lat: 14.6485, lng: 121.0990, impact: "One-Way Bottleneck", time: "6AM - 9AM", color: "#ef4444" },
    { id: "P4", name: "Barangka Flyover Exit", lat: 14.6280, lng: 121.0815, impact: "Merging Conflict", time: "4PM - 7PM", color: "#f97316" },
    { id: "P5", name: "NGI Marikina Heights", lat: 14.6465, lng: 121.1120, impact: "Terminal Congestion", time: "6AM - 8AM", color: "#f59e0b" },
    { id: "P6", name: "Gil Fernando / Sumulong", lat: 14.6348, lng: 121.1008, impact: "Turning Conflict", time: "5PM - 8PM", color: "#7c3aed" },
    { id: "P7", name: "Fortune Barangay Hall", lat: 14.6685, lng: 121.1235, impact: "Narrow Path Queue", time: "6:30AM - 8:30AM", color: "#3b82f6" },
    { id: "P8", name: "Lilac St. Dining Strip", lat: 14.6395, lng: 121.1145, impact: "Double Parking Obstruction", time: "6PM - 9PM", color: "#db2777" },
    { id: "P9", name: "Parang Jct (Shoe Ave)", lat: 14.6615, lng: 121.1155, impact: "School Zone Surge", time: "11AM - 1PM", color: "#10b981" }
];

const getHeatmapColorByWait = (waitMinutes: number) => {
    if (waitMinutes > 30) return "#be123c"; 
    if (waitMinutes >= 30) return "#ff9900"; 
    if (waitMinutes >= 11) return "#ffe063"; 
    return "#22c55e"; 
};

// Map Events Component
function MapEvents({ setZoom, onMapClick }: { setZoom: (z: number) => void, onMapClick: () => void }) {
    const map = useMapEvents({ 
        zoomend: () => setZoom(map.getZoom()),
        click: () => onMapClick() 
    });
    return null;
}

export default function LGUDashboard() {
    const [activeTab, setActiveTab] = useState<"pain" | "congestion" | "peak">("pain");
    const [zoomLevel, setZoomLevel] = useState(14);
    const [weather, setWeather] = useState({ temp: 31, main: "Clear", loading: true });
    const [roadPaths, setRoadPaths] = useState<any[]>([]);
    const [loadingRoads, setLoadingRoads] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    // Track Screen Size for Responsive Logic
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${WEATHER_API_KEY}`);
                if (res.ok) {
                    const data = await res.json();
                    setWeather({ temp: Math.round(data.main.temp), main: data.weather[0].main, loading: false });
                } else { setWeather({ temp: 31, main: "Clouds", loading: false }); }
            } catch { setWeather({ temp: 31, main: "Clouds", loading: false }); }
        };
        fetchWeather();
    }, []);

    useEffect(() => {
        const fetchRoutes = async () => {
            // Check if routes are already cached in localStorage
            const cachedRoutes = localStorage.getItem('osrm_routes_cache');
            if (cachedRoutes) {
                try {
                    const parsed = JSON.parse(cachedRoutes);
                    setRoadPaths(parsed);
                    setLoadingRoads(false);
                    return;
                } catch (e) {
                    console.warn('Failed to parse cached routes', e);
                }
            }

            setLoadingRoads(true);
            const fetched = await Promise.all(segmentConfigs.map(async (seg) => {
                try {
                    const coordsStr = seg.points.map(p => `${p[1]},${p[0]}`).join(';');
                    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`);
                    const data = await res.json();
                    return { ...seg, path: data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]) };
                } catch { return { ...seg, path: seg.points }; }
            }));
            setRoadPaths(fetched);
            // Cache the routes in localStorage
            localStorage.setItem('osrm_routes_cache', JSON.stringify(fetched));
            setLoadingRoads(false);
        };
        fetchRoutes();
    }, []);

    const clearSelection = () => setSelectedItem(null);

    const handleSelect = (item: any, type: string) => {
        setSelectedItem({ ...item, dataType: type });
    };

    return (
        <div className="flex flex-col h-screen w-full relative bg-slate-100 overflow-hidden font-sans text-slate-900">
            {/* INJECT STYLES FOR GLOW EFFECT & RESPONSIVE TOOLTIPS */}
            <style>{MAP_STYLES}</style>
            
            <div className="flex-1 relative z-0">
                <MapContainer center={[14.6330, 121.0980]} zoom={14} zoomControl={false} maxBounds={MARIKINA_BOUNDS} maxBoundsViscosity={1.0} minZoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    
                    {/* HIDE ZOOM ON MOBILE */}
                    {!isMobile && <ZoomControl position="bottomleft" />}
                    
                    <MapEvents setZoom={setZoomLevel} onMapClick={clearSelection} />

                    {/* --- RENDER ROADS (LINES) --- */}
                    {!loadingRoads && roadPaths.map((r) => {
                        const isSelected = selectedItem?.id === r.id;
                        return (
                            <Polyline 
                                key={r.id} 
                                positions={r.path} 
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        handleSelect(r, 'road');
                                    },
                                    mouseover: () => handleSelect(r, 'road')
                                }}
                                pathOptions={{ 
                                    color: activeTab === 'congestion' ? r.color : "#cbd5e1", 
                                    weight: isSelected ? 12 : (activeTab === 'congestion' ? 8 : 3), 
                                    opacity: isSelected ? 1 : (activeTab === 'congestion' ? 0.9 : 0.4),
                                    lineCap: 'round',
                                    className: isSelected ? "map-selected" : "" 
                                }}
                            >
                                {activeTab === 'congestion' && (
                                    <Tooltip sticky direction="right" className="glass-tooltip">
                                        <div className="text-[8px] md:text-[10px] font-bold leading-tight">
                                            {r.name}: <span className="font-black">{r.count}</span>
                                        </div>
                                    </Tooltip>
                                )}
                            </Polyline>
                        );
                    })}
                    
                    {/* --- RENDER HEATMAPS (CIRCLES) --- */}
                    {activeTab === 'pain' && marikinaHeatmaps.map((p) => {
                        const dynamicColor = getHeatmapColorByWait(p.wait);
                        const isSelected = selectedItem?.id === p.id;

                        return (
                            <Circle 
                                key={p.id} 
                                center={[p.lat, p.lng]} 
                                radius={p.radius}
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        handleSelect(p, 'heatmap');
                                    },
                                    mouseover: () => handleSelect(p, 'heatmap')
                                }}
                                pathOptions={{ 
                                    fillColor: dynamicColor, 
                                    color: isSelected ? "white" : dynamicColor, 
                                    weight: isSelected ? 4 : 1, 
                                    fillOpacity: 0.6,
                                    className: isSelected ? "map-selected" : "" 
                                }} 
                            >
                                <Tooltip permanent direction="center" className="glass-tooltip">
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="font-black text-[7px] md:text-[8px] uppercase tracking-wider" style={{ color: dynamicColor }}>WAIT</span>
                                        <span className="font-black text-[9px] md:text-xs text-slate-800">{p.wait}m</span>
                                    </div>
                                </Tooltip>
                            </Circle>
                        );
                    })}

                    {/* --- RENDER RISK ZONES (DASHED CIRCLES) --- */}
                    {activeTab === 'peak' && peakRiskZones.map((z) => {
                         const isSelected = selectedItem?.id === z.id;
                         return (
                            <Circle 
                                key={z.id} 
                                center={[z.lat, z.lng]} 
                                radius={400} 
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        handleSelect(z, 'risk');
                                    },
                                    mouseover: () => handleSelect(z, 'risk')
                                }}
                                pathOptions={{ 
                                    fillColor: z.color, 
                                    color: isSelected ? "white" : z.color, 
                                    weight: isSelected ? 5 : 3, 
                                    fillOpacity: 0.3, 
                                    dashArray: '10, 10',
                                    className: isSelected ? "map-selected" : "" 
                                }}
                            >
                                <Tooltip permanent direction="top" className="glass-tooltip">
                                    <div className="flex flex-col items-center leading-none" style={{ borderColor: z.color }}>
                                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-wider text-slate-500">RISK</span>
                                        <span className="text-[8px] md:text-[10px] font-bold text-slate-900 whitespace-nowrap">{z.impact}</span>
                                    </div>
                                </Tooltip>
                            </Circle>
                         )
                    })}
                </MapContainer>

                {/* --- DYNAMIC INFO CARD --- */}
                {/* RESPONSIVE UPDATE: w-auto (auto width) + left-4 right-4 (strech across) on mobile. Fixed w-72 on Desktop. */}
                {selectedItem && (
                    <div className="absolute top-20 left-4 right-4 md:left-auto md:top-auto md:bottom-6 md:right-4 md:w-72 z-[600] animate-in slide-in-from-right-4 duration-300">
                        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-none overflow-hidden">
                            <div className={`h-1.5 w-full ${
                                selectedItem.dataType === 'risk' ? 'bg-purple-500' :
                                selectedItem.dataType === 'road' ? 'bg-indigo-500' :
                                'bg-red-500' 
                            }`} />
                            
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase leading-tight">{selectedItem.name}</h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {selectedItem.dataType === 'heatmap' ? 'Crowd Analytics' : 
                                             selectedItem.dataType === 'road' ? 'Traffic Segment' : 'Risk Zone'}
                                        </span>
                                    </div>
                                    <div className={`p-1.5 rounded-md ${
                                        selectedItem.dataType === 'risk' ? 'bg-purple-100 text-purple-600' :
                                        selectedItem.dataType === 'road' ? 'bg-indigo-100 text-indigo-600' :
                                        'bg-red-100 text-red-600' 
                                    }`}>
                                        {selectedItem.dataType === 'heatmap' ? <Users size={16} /> : 
                                         selectedItem.dataType === 'road' ? <Navigation size={16} /> : <AlertOctagon size={16} />}
                                    </div>
                                </div>

                                <div className="space-y-3 mt-3">
                                    {selectedItem.dataType === 'heatmap' && (
                                        <>
                                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Pax</span>
                                                <span className="text-sm font-black text-slate-800">{selectedItem.count} <span className="text-[10px] text-slate-400 font-medium">people</span></span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Wait Time</span>
                                                <span className={`text-sm font-black ${selectedItem.wait > 30 ? 'text-red-600' : 'text-amber-600'}`}>{selectedItem.wait} <span className="text-[10px] text-slate-400 font-medium">min</span></span>
                                            </div>
                                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Info size={10} className="text-blue-600" />
                                                    <span className="text-[9px] font-bold text-blue-600 uppercase">Recommended Action</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-700 leading-tight">{selectedItem.action}</p>
                                            </div>
                                        </>
                                    )}

                                    {selectedItem.dataType === 'road' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Avg Speed</span>
                                                    <span className="text-sm font-black text-slate-800">{selectedItem.count}</span>
                                                </div>
                                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Status</span>
                                                    <span className="text-xs font-black px-2 py-0.5 rounded text-white inline-block" style={{ backgroundColor: selectedItem.color }}>{selectedItem.status}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedItem.dataType === 'risk' && (
                                        <>
                                            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <AlertTriangle size={10} className="text-purple-600" />
                                                    <span className="text-[9px] font-bold text-purple-600 uppercase">Primary Impact</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-700">{selectedItem.impact}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock size={12} className="text-slate-400" />
                                                <span className="text-[10px] font-medium text-slate-500">Peak Hours: <span className="font-bold text-slate-800">{selectedItem.time}</span></span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}


                {/* HEADER - RESPONSIVE */}
                {/* Fixed width on Desktop, Full Width with margins on Mobile */}
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-[240px] z-[500]">
                    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-none">
                        <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 bg-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg"><Activity size={18} /></div>
                                    <div>
                                        <CardTitle className="text-xs font-black text-slate-900 tracking-tighter uppercase">Marikina Mobility</CardTitle>
                                            <CardDescription className="text-[9px] font-bold text-blue-600 uppercase mt-1 flex items-center gap-1">
                                                {loadingRoads ? <><Loader2 size={10} className="animate-spin" /> Syncing routes...</> : "LGU Live Dashboard"}
                                            </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="destructive" className="animate-pulse text-[8px] h-4">LIVE</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* LIST VIEW (BOTTOM) - RESPONSIVE HEIGHT & FULL WIDTH */}
            {/* NO MAX-WIDTHS HERE - Takes full screen width */}
            <div className="z-[500] bg-white border-t h-[40%] md:h-[35%] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full">
                <div className="p-3 border-b flex justify-center bg-slate-50">
                    <div className="grid grid-cols-3 gap-2 w-full bg-slate-200 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('pain')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'pain' ? 'bg-white shadow-md text-red-600' : 'text-slate-500 hover:bg-white/50'}`}><Users size={16} /> <span>PAIN POINTS</span></button>
                        <button onClick={() => setActiveTab('congestion')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'congestion' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:bg-white/50'}`}><Navigation size={16} /> <span>CONGESTION</span></button>
                        <button onClick={() => setActiveTab('peak')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'peak' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500 hover:bg-white/50'}`}><Clock size={16} /> <span>PEAK ZONES</span></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 w-full">
                    {activeTab === 'pain' && marikinaHeatmaps.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleSelect(item, 'heatmap')}
                            className={`flex items-center justify-between p-3 bg-white rounded-xl border mb-2 shadow-sm cursor-pointer transition-all ${selectedItem?.id === item.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-black text-[10px] border border-red-100">{item.wait}m</div>
                                <div><div className="font-bold text-sm text-slate-800">{item.name}</div><div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Passenger Surge</div></div>
                            </div>
                            <div className="text-right"><div className="text-lg font-black text-slate-900 leading-none">{item.count}</div><span className={`text-[8px] font-bold uppercase italic ${item.wait > 30 ? 'text-red-500' : 'text-amber-500'}`}>Wait Label: {item.wait > 30 ? 'Critical' : 'Moderate'}</span></div>
                        </div>
                    ))}
                    {activeTab === 'congestion' && roadPaths.map(road => (
                        <div 
                            key={road.id} 
                            onClick={() => handleSelect(road, 'road')}
                            className={`flex items-center justify-between p-3 bg-white rounded-xl border mb-2 shadow-sm cursor-pointer transition-all ${selectedItem?.id === road.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="font-bold text-sm text-slate-800">{road.name}</div>
                            <div className="flex items-center gap-3"><span className="text-xs font-bold text-slate-500">{road.count}</span><Badge style={{ backgroundColor: road.color }} className="text-white text-[9px] font-bold uppercase border-none">{road.status}</Badge></div>
                        </div>
                    ))}
                    {activeTab === 'peak' && peakRiskZones.map(zone => (
                         <div 
                            key={zone.id} 
                            onClick={() => handleSelect(zone, 'risk')}
                            className={`flex items-center justify-between p-3 bg-white rounded-xl border-l-4 border shadow-sm mb-2 cursor-pointer transition-all ${selectedItem?.id === zone.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                            style={{ borderLeftColor: zone.color }}
                         >
                            <div><div className="font-bold text-sm text-slate-800">{zone.name}</div><div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Peak Impact: {zone.impact}</div></div>
                            <div className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-600 uppercase tracking-tighter">{zone.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}