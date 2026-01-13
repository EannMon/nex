import { useState, useEffect } from "react";
import { 
    MapContainer, TileLayer, Circle, Polyline, Tooltip, 
    ZoomControl, Marker, useMapEvents 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
    Activity, Users, Navigation, Building2, Stethoscope, Loader2,
    Sun, Thermometer, Clock, AlertCircle, Menu, Info, ChevronDown, List, Layers
} from "lucide-react";

// --- 1. CONFIGURATION ---
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; 
const CITY_NAME = "Marikina,PH";

const MARIKINA_BOUNDS: L.LatLngBoundsExpression = [
    [14.6050, 121.0750], 
    [14.6750, 121.1450]
];

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
    { id: 1, name: "Marikina Bayan", lat: 14.6335, lng: 121.0955, count: 520, wait: 45, radius: 675 },
    { id: 2, name: "Riverbanks Center", lat: 14.6300, lng: 121.0880, count: 410, wait: 35, radius: 525 },
    { id: 3, name: "Barangka Flyover", lat: 14.6285, lng: 121.0825, count: 440, wait: 40, radius: 600 },
    { id: 4, name: "LRT-2 Santolan Station", lat: 14.6220, lng: 121.0850, count: 480, wait: 32, radius: 480 },
    { id: 5, name: "Concepcion Uno", lat: 14.6515, lng: 121.1040, count: 390, wait: 28, radius: 420 },
    { id: 6, name: "SM Marikina Area", lat: 14.6250, lng: 121.0910, count: 310, wait: 25, radius: 375 },
    { id: 7, name: "Marcos Hwy - Gil Fernando", lat: 14.6232, lng: 121.1000, count: 350, wait: 22, radius: 330 },
    { id: 8, name: "Tumana Bridge Access", lat: 14.6480, lng: 121.0995, count: 210, wait: 18, radius: 270 },
    { id: 9, name: "Parang-Fortune Jct", lat: 14.6610, lng: 121.1150, count: 220, wait: 15, radius: 225 },
    { id: 10, name: "Kalumpang (J.P. Rizal)", lat: 14.6200, lng: 121.0920, count: 190, wait: 14, radius: 210 },
    { id: 11, name: "Marikina Heights (NGI)", lat: 14.6465, lng: 121.1120, count: 250, wait: 12, radius: 180 },
    { id: 12, name: "Concepcion Dos (Lilac St)", lat: 14.6390, lng: 121.1150, count: 180, wait: 9, radius: 135 },
    { id: 13, name: "Fortune Barangay Hall", lat: 14.6680, lng: 121.1230, count: 140, wait: 7, radius: 105 },
    { id: 14, name: "SSS Village (Panorama)", lat: 14.6360, lng: 121.1250, count: 130, wait: 5, radius: 75 }
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

// --- 3. LEGEND DEFINITIONS ---
const LEGENDS = {
    pain: [
        { color: "#be123c", label: "Critical Label", desc: "Wait > 30 mins." },
        { color: "#ff9900", label: "High Label", desc: "Wait 21-30 mins." },
        { color: "#ffe063", label: "Moderate Label", desc: "Wait 11-20 mins." },
        { color: "#22c55e", label: "Low Label", desc: "Wait < 10 mins." },
    ],
    congestion: [
        { color: "#ef4444", label: "Gridlock Label", desc: "Velocity < 10 kph." },
        { color: "#f59e0b", label: "Heavy Label", desc: "Velocity 10-25 kph." },
        { color: "#22c55e", label: "Flowing Label", desc: "Velocity > 25 kph." },
    ],
    peak: [
        { color: "#7c3aed", label: "Bottleneck Label", desc: "Temporal delays." },
        { color: "#f59e0b", label: "Pedestrian Label", desc: "Surge zones." },
        { color: "#ef4444", label: "Strict Flow Label", desc: "One-way/Merge." },
        { color: "#db2777", label: "Commercial Label", desc: "Street parking." },
    ]
};

const getHeatmapColorByWait = (waitMinutes: number) => {
    if (waitMinutes > 30) return "#be123c"; 
    if (waitMinutes >= 21) return "#ff9900"; 
    if (waitMinutes >= 11) return "#ffe063"; 
    return "#22c55e"; 
};

function MapEvents({ setZoom }: { setZoom: (z: number) => void }) {
    const map = useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
    return null;
}

export default function LGUDashboard() {
    const [activeTab, setActiveTab] = useState<"pain" | "congestion" | "peak">("pain");
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(14);
    const [weather, setWeather] = useState({ temp: 31, main: "Clear", loading: true });
    const [roadPaths, setRoadPaths] = useState<any[]>([]);
    const [loadingRoads, setLoadingRoads] = useState(true);

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
            setLoadingRoads(false);
        };
        fetchRoutes();
    }, []);

    return (
        <div className="flex flex-col h-screen w-full relative bg-slate-100 overflow-hidden font-sans text-slate-900">
            <div className="flex-1 relative z-0">
                <MapContainer center={[14.6330, 121.0980]} zoom={14} zoomControl={false} maxBounds={MARIKINA_BOUNDS} maxBoundsViscosity={1.0} minZoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <ZoomControl position="bottomright" />
                    <MapEvents setZoom={setZoomLevel} />

                    {!loadingRoads && roadPaths.map((r) => (
                        <Polyline 
                            key={r.id} 
                            positions={r.path} 
                            pathOptions={{ 
                                color: activeTab === 'congestion' ? r.color : "#cbd5e1", 
                                weight: activeTab === 'congestion' ? 8 : 4, 
                                opacity: activeTab === 'congestion' ? 0.9 : 0.4, 
                                lineCap: 'round' 
                            }}
                        />
                    ))}

                    {activeTab === 'pain' && marikinaHeatmaps.map((p) => {
                        const dynamicColor = getHeatmapColorByWait(p.wait);
                        return (
                            <Circle key={p.id} center={[p.lat, p.lng]} pathOptions={{ fillColor: dynamicColor, color: dynamicColor, weight: 1, fillOpacity: 0.6 }} radius={p.radius}>
                                <Tooltip permanent direction="center" className="glass-tooltip"><div className="glass-content"><span className="glass-label" style={{ color: dynamicColor }}>WAIT LABEL</span><span className="glass-value">{p.wait}m</span></div></Tooltip>
                            </Circle>
                        );
                    })}

                    {activeTab === 'peak' && peakRiskZones.map((z) => (
                        <Circle key={z.id} center={[z.lat, z.lng]} radius={400} pathOptions={{ fillColor: z.color, color: z.color, weight: 3, fillOpacity: 0.3, dashArray: '10, 10' }}>
                            <Tooltip permanent direction="top" className="glass-tooltip"><div className="glass-content" style={{ borderColor: z.color }}><span className="glass-label uppercase text-[8px] font-bold">RISK LABEL</span><span className="glass-value text-[10px] font-bold">{z.impact}</span></div></Tooltip>
                        </Circle>
                    ))}
                </MapContainer>

                {/* --- COMPACT MINIMIZABLE LEGEND (BOTTOM LEFT) --- */}
                <div className="absolute bottom-6 left-4 z-[500] flex flex-col items-start gap-2">
                    {!isLegendExpanded ? (
                        <div className="group flex items-center gap-2">
                            <button 
                                onClick={() => setIsLegendExpanded(true)}
                                className="h-10 w-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all border border-slate-200"
                                title="Click to view Legend"
                            >
                                <List size={20} />
                            </button>
                            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-lg flex flex-col pointer-events-none group-hover:bg-white transition-all">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-none">Legend</span>
                                <span className="text-[8px] font-bold text-blue-600 uppercase mt-0.5 animate-pulse">Click to expand</span>
                            </div>
                        </div>
                    ) : (
                        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-none p-4 w-44 md:w-52 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 bg-blue-100 rounded-md flex items-center justify-center text-blue-700"><Layers size={12} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Map Guide</span>
                                </div>
                                <button onClick={() => setIsLegendExpanded(false)}><ChevronDown size={16} className="text-slate-400 hover:text-slate-600" /></button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {LEGENDS[activeTab].map((item, idx) => (
                                    <div key={idx} className="group/item relative flex items-center gap-3 cursor-help">
                                        <div style={{ backgroundColor: item.color }} className="h-3 w-3 rounded-full border-2 border-white shadow-sm transition-all duration-300 group-hover/item:scale-150 group-hover/item:shadow-[0_0_12px_4px_rgba(255,255,255,1)]" />
                                        <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                        <div className="absolute left-full ml-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-2 group-hover/item:translate-x-0 pointer-events-none z-[600]">
                                            <div className="bg-slate-900/95 backdrop-blur text-white text-[9px] py-2 px-3 rounded-lg shadow-2xl w-32 leading-relaxed border border-white/10 text-center font-medium">
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="absolute top-4 left-4 z-[500] w-[240px]">
                    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-none">
                        <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 bg-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg"><Activity size={18} /></div>
                                    <div>
                                        <CardTitle className="text-xs font-black text-slate-900 tracking-tighter uppercase">Marikina Mobility</CardTitle>
                                        <CardDescription className="text-[9px] font-bold text-blue-600 uppercase mt-1">LGU Live Dashboard</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="destructive" className="animate-pulse text-[8px] h-4">LIVE</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <div className="z-[500] bg-white border-t h-[35%] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="p-3 border-b flex justify-center bg-slate-50">
                    <div className="grid grid-cols-3 gap-2 w-full max-w-xl bg-slate-200 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('pain')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'pain' ? 'bg-white shadow-md text-red-600' : 'text-slate-500 hover:bg-white/50'}`}><Users size={16} /> <span>PAIN POINTS</span></button>
                        <button onClick={() => setActiveTab('congestion')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'congestion' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:bg-white/50'}`}><Navigation size={16} /> <span>CONGESTION</span></button>
                        <button onClick={() => setActiveTab('peak')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'peak' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500 hover:bg-white/50'}`}><Clock size={16} /> <span>PEAK ZONES</span></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
                    {activeTab === 'pain' && marikinaHeatmaps.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border mb-2 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-black text-[10px] border border-red-100">{item.wait}m</div>
                                <div><div className="font-bold text-sm text-slate-800">{item.name}</div><div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Passenger Surge</div></div>
                            </div>
                            <div className="text-right"><div className="text-lg font-black text-slate-900 leading-none">{item.count}</div><span className={`text-[8px] font-bold uppercase italic ${item.wait > 30 ? 'text-red-500' : 'text-amber-500'}`}>Wait Label: {item.wait > 30 ? 'Critical' : 'Moderate'}</span></div>
                        </div>
                    ))}
                    {activeTab === 'congestion' && roadPaths.map(road => (
                        <div key={road.id} className="flex items-center justify-between p-3 bg-white rounded-xl border mb-2 shadow-sm">
                            <div className="font-bold text-sm text-slate-800">{road.name}</div>
                            <div className="flex items-center gap-3"><span className="text-xs font-bold text-slate-500">{road.count}</span><Badge style={{ backgroundColor: road.color }} className="text-white text-[9px] font-bold uppercase border-none">{road.status}</Badge></div>
                        </div>
                    ))}
                    {activeTab === 'peak' && peakRiskZones.map(zone => (
                         <div key={zone.id} className="flex items-center justify-between p-3 bg-white rounded-xl border-l-4 border shadow-sm mb-2" style={{ borderLeftColor: zone.color }}>
                            <div><div className="font-bold text-sm text-slate-800">{zone.name}</div><div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Peak Impact: {zone.impact}</div></div>
                            <div className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-600 uppercase tracking-tighter">{zone.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}