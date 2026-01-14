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
    Info, AlertTriangle, AlertOctagon, Plus, X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PainPoint } from "@/components/MainLayout";

const MARIKINA_BOUNDS: L.LatLngBoundsExpression = [
    [14.6050, 121.0750], 
    [14.6750, 121.1450]
];

// --- CSS FOR MAP STYLING ---
const MAP_STYLES = `
  .map-selected {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
    transition: all 0.3s ease;
    z-index: 1000 !important;
  }

  .leaflet-tooltip.glass-tooltip {
    background: rgba(255, 255, 255, 0.90);
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 6px;
    padding: 2px 6px !important;
    white-space: nowrap;
  }

  .leaflet-tooltip-top:before, 
  .leaflet-tooltip-bottom:before, 
  .leaflet-tooltip-left:before, 
  .leaflet-tooltip-right:before {
    border: none !important; 
  }

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

export default function LGUDashboard({ 
    painPoints = [], 
    onAddPainPoint, 
    onRemovePainPoint 
}: { 
    painPoints?: PainPoint[]; 
    onAddPainPoint?: (point: Omit<PainPoint, "id">) => void;
    onRemovePainPoint?: (id: number) => void;
}) {
    const [activeTab, setActiveTab] = useState<"pain" | "congestion" | "peak">("pain");
    const [roadPaths, setRoadPaths] = useState<any[]>([]);
    const [loadingRoads, setLoadingRoads] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const [formData, setFormData] = useState({
        area: "",
        type: "Passenger Surge",
        level: "Moderate" as const,
        paxCount: 100,
        wait: 15,
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchRoutes = async () => {
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
            localStorage.setItem('osrm_routes_cache', JSON.stringify(fetched));
            setLoadingRoads(false);
        };
        fetchRoutes();
    }, []);

    const clearSelection = () => setSelectedItem(null);

    const handleSelect = (item: any, type: string) => {
        setSelectedItem({ ...item, dataType: type });
    };

    const handleAddPainPoint = () => {
        if (!formData.area.trim() || !onAddPainPoint) return;

        // FIXED: Removed 'count' property as it was causing a type error
        // The PainPoint interface uses 'paxCount' instead.
        onAddPainPoint({
            area: formData.area,
            type: formData.type,
            level: formData.level,
            paxCount: formData.paxCount,
            wait: formData.wait,
            trend: "New",
            affected: "To be determined",
            status: "Monitoring",
            lat: 14.6330 + (Math.random() - 0.5) * 0.05,
            lng: 121.0980 + (Math.random() - 0.5) * 0.05,
            radius: 400,
            action: "Monitor situation",
        });

        setFormData({
            area: "",
            type: "Passenger Surge",
            level: "Moderate",
            paxCount: 100,
            wait: 15,
        });
        setShowAddForm(false);
    };

    return (
        <div className="flex flex-col h-full w-full relative bg-slate-100 overflow-hidden font-sans text-slate-900">
            <style>{MAP_STYLES}</style>
            
            <div className="flex-1 relative z-0">
                <MapContainer center={[14.6330, 121.0980]} zoom={14} zoomControl={false} maxBounds={MARIKINA_BOUNDS} maxBoundsViscosity={1.0} minZoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    {!isMobile && <ZoomControl position="bottomleft" />}
                    <MapEvents setZoom={() => {}} onMapClick={clearSelection} />

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
                    
                    {activeTab === 'pain' && painPoints.map((p) => {
                        const dynamicColor = getHeatmapColorByWait(p.wait || 0);
                        const isSelected = selectedItem?.id === p.id;

                        return (
                            <Circle 
                                key={p.id} 
                                center={[p.lat || 14.6330, p.lng || 121.0980]} 
                                radius={p.radius || 500}
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
                                        <span className="font-black text-[9px] md:text-xs text-slate-800">{p.wait || 0}m</span>
                                    </div>
                                </Tooltip>
                            </Circle>
                        );
                    })}

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

            <div className="z-[500] bg-white border-t h-[40%] md:h-[35%] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full">
                <div className="p-3 border-b flex justify-between items-center bg-slate-50">
                    <div className="grid grid-cols-3 gap-2 w-full bg-slate-200 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('pain')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'pain' ? 'bg-white shadow-md text-red-600' : 'text-slate-500 hover:bg-white/50'}`}><Users size={16} /> <span>PAIN POINTS</span></button>
                        <button onClick={() => setActiveTab('congestion')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'congestion' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:bg-white/50'}`}><Navigation size={16} /> <span>CONGESTION</span></button>
                        <button onClick={() => setActiveTab('peak')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === 'peak' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500 hover:bg-white/50'}`}><Clock size={16} /> <span>PEAK ZONES</span></button>
                    </div>
                    {activeTab === 'pain' && onAddPainPoint && (
                        <Button 
                            size="sm" 
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                        >
                            {showAddForm ? <X size={16} /> : <Plus size={16} />}
                        </Button>
                    )}
                </div>

                {showAddForm && activeTab === 'pain' && (
                    <div className="p-4 bg-blue-50 border-b border-blue-100 flex gap-2 flex-wrap items-end">
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-700 block mb-1">Area Name</label>
                            <Input 
                                placeholder="e.g., Shoe Avenue"
                                value={formData.area}
                                onChange={(e) => setFormData({...formData, area: e.target.value})}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pax Count</label>
                            <Input 
                                type="number"
                                placeholder="100"
                                value={formData.paxCount}
                                onChange={(e) => setFormData({...formData, paxCount: parseInt(e.target.value) || 0})}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="w-20">
                            <label className="text-xs font-bold text-slate-700 block mb-1">Wait (m)</label>
                            <Input 
                                type="number"
                                placeholder="15"
                                value={formData.wait}
                                onChange={(e) => setFormData({...formData, wait: parseInt(e.target.value) || 0})}
                                className="h-8 text-xs"
                            />
                        </div>
                        <select 
                            value={formData.level}
                            onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                            className="h-8 text-xs px-2 rounded border border-slate-200"
                        >
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                        <Button 
                            size="sm"
                            onClick={handleAddPainPoint}
                            className="bg-green-600 hover:bg-green-700 text-white h-8"
                        >
                            Add
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 w-full">
                    {activeTab === 'pain' && painPoints.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleSelect(item, 'heatmap')}
                            className={`flex items-center justify-between p-3 bg-white rounded-xl border mb-2 shadow-sm cursor-pointer transition-all ${selectedItem?.id === item.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-black text-[10px] border border-red-100">{item.wait || 0}m</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm text-slate-800">{item.area}</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">{item.type}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="text-lg font-black text-slate-900 leading-none">{item.paxCount}</div>
                                    <span className={`text-[8px] font-bold uppercase italic ${(item.wait || 0) > 30 ? 'text-red-500' : 'text-amber-500'}`}>{item.level}</span>
                                </div>
                                {onRemovePainPoint && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemovePainPoint(item.id);
                                        }}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </div>
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