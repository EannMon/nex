import { useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, Polyline, Tooltip, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // You might need to add Tabs component via shadcn or just use buttons

// Icons
import { Activity, AlertTriangle, Users, Navigation, MapPin, Clock, Car, HardHat, Info } from "lucide-react";

// --- MARIKINA MOCK DATA ---
const marikinaHeatmaps = [
    { id: 1, name: "Riverbanks Station", lat: 14.6295, lng: 121.0881, count: 245, status: "critical", risk: "Pedestrian Bottleneck", wait: "35m", riskType: "High", icon: "terminal" },
    { id: 2, name: "Marikina Bayan (Market)", lat: 14.6335, lng: 121.0955, count: 412, status: "critical", risk: "Slippery Road (Wet Market)", wait: "45m", riskType: "Critical", icon: "market" },
    { id: 3, name: "Concepcion Simbahan", lat: 14.6515, lng: 121.1040, count: 85, status: "moderate", risk: "Church Crowd", wait: "15m", riskType: "Low", icon: "stop" },
    { id: 4, name: "LRT-2 Santolan Link", lat: 14.6220, lng: 121.0850, count: 30, status: "low", risk: "Clear", wait: "5m", riskType: "Low", icon: "train" },
    { id: 5, name: "Tumana Bridge Entry", lat: 14.6420, lng: 121.0900, count: 120, status: "high", risk: "Road Maintenance", wait: "25m", riskType: "Medium", icon: "construction" },
];

const roadSegments = [
    { id: 101, path: [[14.622, 121.120], [14.622, 121.110]], color: "#22c55e", status: "Fast", count: "20 cars/m", name: "Marcos Hwy (East)" },
    { id: 102, path: [[14.622, 121.110], [14.622, 121.100]], color: "#eab308", status: "Moderate", count: "45 cars/m", name: "Marcos Hwy (Mid)" },
    { id: 103, path: [[14.622, 121.100], [14.622, 121.085]], color: "#ef4444", status: "Gridlock", count: "80 cars/m", name: "Marcos Hwy (LRT)" },
    { id: 201, path: [[14.634, 121.096], [14.634, 121.115]], color: "#eab308", status: "Moderate", count: "30 cars/m", name: "Sumulong Hi-way" },
];

// Leaflet Icon Fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function LGUDashboard() {
    const [activeTab, setActiveTab] = useState<"heatmap" | "traffic" | "risks">("heatmap");

    const getHeatmapColor = (status: string) => {
        if (status === 'critical') return "#ef4444";
        if (status === 'high') return "#f97316";
        if (status === 'moderate') return "#eab308";
        return "#22c55e";
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            
            {/* --- MAP SECTION (Flex Grow) --- */}
            <div className="flex-1 relative z-0">
                
                {/* FLOATING HEADER */}
                <div className="absolute top-4 left-4 z-[400] max-w-[220px]">
                    <Card className="shadow-xl bg-white/90 backdrop-blur-md border-white/20">
                        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                <div>
                                    <CardTitle className="text-sm font-bold text-slate-800">City Pulse</CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold text-slate-500">Marikina City</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <span className="text-[10px] font-bold text-red-600 tracking-wider">LIVE</span>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <MapContainer 
                    center={[14.6335, 121.0955]} 
                    zoom={14} 
                    zoomControl={false} 
                    style={{ height: "100%", width: "100%" }}
                    className="bg-slate-100"
                >
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <ZoomControl position="topright" />

                    {/* HEATMAP LAYER */}
                    {(activeTab === 'heatmap' || activeTab === 'risks') && marikinaHeatmaps.map((point) => (
                        <Circle
                            key={point.id}
                            center={[point.lat, point.lng]}
                            pathOptions={{ fillColor: getHeatmapColor(point.status), color: getHeatmapColor(point.status), weight: 2, fillOpacity: 0.5 }}
                            radius={point.count * 1.5}
                        >
                            <Tooltip direction="center" offset={[0, 0]} opacity={1} permanent className="glass-tooltip">
                                <div className="flex flex-col items-center">
                                    <span>{point.count} pax</span>
                                </div>
                            </Tooltip>
                            <Popup className="min-w-[220px]">
                                <div className="space-y-3 p-1">
                                    <div className="flex items-start justify-between border-b pb-2">
                                        <h3 className="font-bold text-base leading-tight">{point.name}</h3>
                                        <Badge variant={point.status === 'critical' ? 'destructive' : 'secondary'} className="text-[10px] h-5">{point.status}</Badge>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Source: <span className="font-semibold text-blue-600">GPS Aggregation</span>
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    ))}

                    {/* TRAFFIC LAYER */}
                    {(activeTab === 'traffic' || activeTab === 'risks') && roadSegments.map((road) => (
                        <Polyline
                            key={road.id}
                            positions={road.path as [number, number][]}
                            pathOptions={{ color: road.color, weight: 8, opacity: 0.8, lineCap: 'round' }}
                        >
                             <Tooltip sticky className="glass-tooltip">
                                <div className="flex items-center gap-1"><Car size={10} /> {road.status}</div>
                             </Tooltip>
                        </Polyline>
                    ))}
                </MapContainer>
            </div>

            {/* --- BOTTOM PANEL (The "First Prompt" Style restored) --- */}
            <div className="z-[400] bg-white/80 backdrop-blur-xl border-t shadow-[0_-5px_20px_rgba(0,0,0,0.1)] h-[35%] min-h-[250px] flex flex-col">
                
                {/* Tabs Header */}
                <div className="p-2 border-b flex justify-center bg-white/50">
                    <div className="grid grid-cols-3 gap-2 w-full max-w-md p-1 bg-slate-100 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('heatmap')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'heatmap' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Users size={14} /> Crowd Heatmap
                        </button>
                        <button 
                            onClick={() => setActiveTab('traffic')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'traffic' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Navigation size={14} /> Congestion
                        </button>
                        <button 
                            onClick={() => setActiveTab('risks')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'risks' ? 'bg-white shadow text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <AlertTriangle size={14} /> Risk Zones
                        </button>
                    </div>
                </div>

                {/* Content Area (Scrollable List) */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                {activeTab === 'heatmap' ? 'Waiting Pain Points' : activeTab === 'traffic' ? 'Congestion Analytics' : 'Peak-Hour Risk Zones'}
                            </h3>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                Source: User GPS + Reports
                            </span>
                        </div>

                        {/* LIST: CROWD */}
                        {activeTab === 'heatmap' && (
                            <div className="space-y-2">
                                {marikinaHeatmaps.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${item.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800">{item.name}</div>
                                                <div className="text-xs text-slate-500">Wait Time: <span className="font-semibold text-blue-600">{item.wait}</span></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg leading-none">{item.count}</div>
                                            <div className="text-[10px] text-slate-400">PAX</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LIST: TRAFFIC */}
                        {activeTab === 'traffic' && (
                            <div className="space-y-2">
                                {roadSegments.map(road => (
                                    <div key={road.id} className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${road.status === 'Gridlock' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <Car size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800">{road.name}</div>
                                                <div className="text-xs text-slate-500">Flow: {road.count}</div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{road.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                         {/* LIST: RISKS */}
                         {activeTab === 'risks' && (
                            <div className="space-y-2">
                                {marikinaHeatmaps.filter(h => h.status === 'critical' || h.status === 'high').map(risk => (
                                    <div key={risk.id} className="bg-white p-3 rounded-xl border-l-4 border-l-red-500 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="text-red-500" size={18} />
                                            <div>
                                                <div className="font-bold text-sm text-slate-800">{risk.risk}</div>
                                                <div className="text-xs text-slate-500">{risk.name}</div>
                                            </div>
                                        </div>
                                        <Badge variant="destructive">HIGH RISK</Badge>
                                    </div>
                                ))}
                                <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg text-center">
                                    <Info size={12} className="inline mr-1"/> Data derived from user incident reports.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}