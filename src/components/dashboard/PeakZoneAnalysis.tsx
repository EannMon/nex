import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, ShieldCheck, Calendar, Timer, History, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PainPoint } from "@/components/MainLayout";

// Pedestrian Risk Zones Data
const peakRiskZones = [
    { id: "P1", name: "Marcos Hwy Bridge", hazards: ["Fast-moving vehicles (60+ kph)", "Poor drainage during rain"], riskLevel: "Critical", affectedCount: 450 },
    { id: "P2", name: "Sumulong Bayan Cross", hazards: ["Broken pavement sections", "Inadequate sidewalk width"], riskLevel: "High", affectedCount: 320 },
    { id: "P3", name: "Tumana Bridge North", hazards: ["Fast-moving vehicles (55+ kph)", "Flash flooding risk during typhoons"], riskLevel: "Critical", affectedCount: 280 },
    { id: "P4", name: "Barangka Flyover Exit", hazards: ["Uneven road surface", "High vehicle speeds at exit"], riskLevel: "High", affectedCount: 210 },
    { id: "P5", name: "NGI Marikina Heights", hazards: ["Broken steps/stairs", "Wet/slippery surfaces during rain"], riskLevel: "High", affectedCount: 380 },
    { id: "P6", name: "Gil Fernando / Sumulong", hazards: ["Unpaved sidewalk sections", "Poor lighting at night"], riskLevel: "Moderate", affectedCount: 150 },
    { id: "P7", name: "Fortune Barangay Hall", hazards: ["Pothole accumulation", "Drainage issues causing water pooling"], riskLevel: "Moderate", affectedCount: 120 },
    { id: "P8", name: "Lilac St. Dining Strip", hazards: ["Parked vehicles blocking walkway", "Fast-moving delivery vehicles (45+ kph)"], riskLevel: "High", affectedCount: 290 },
    { id: "P9", name: "Parang Jct (Shoe Ave)", hazards: ["Unpaved road near school", "High-speed traffic zone", "Drainage backup during rains"], riskLevel: "Critical", affectedCount: 520 }
];

export default function PeakZoneAnalysis({ 
    painPoints = [], 
    onRemovePainPoint 
}: { 
    painPoints?: PainPoint[]; 
    onRemovePainPoint?: (id: number) => void;
}) {
    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-50">
                            <Clock className="text-amber-600 h-8 w-8" /> 
                            Peak Zone Intelligence
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base tracking-tight">Temporal risk modeling and peak-hour safety metrics.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-amber-200 bg-amber-50 text-amber-700 animate-pulse">
                        <History className="h-3 w-3 mr-1" /> PREDICTIVE ENGINE ACTIVE
                    </Badge>
                </div>

                {/* RISK WINDOW CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {painPoints.map((zone) => (
                        <Card key={zone.id} className={`border-l-4 shadow-sm hover:translate-y-[-2px] transition-all relative ${
                            zone.level === 'Critical' ? 'border-l-red-500' : 'border-l-amber-500'
                        }`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter flex items-center gap-1">
                                        <Timer size={10}/> Peak Window
                                    </span>
                                    <Badge variant={zone.level === 'Critical' ? 'destructive' : 'secondary'} className="text-[9px]">
                                        {zone.level}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold mt-2">{zone.area}</CardTitle>
                                <CardDescription className="text-xs font-medium flex items-center gap-1 text-slate-500">
                                    <Calendar size={12}/> {zone.status}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-[11px] p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                                    <strong>Type:</strong> {zone.type}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* SAFETY SCORE INDEX */}
                <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-4 md:p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-400" /> 
                            Pain Point Safety Assessment
                        </CardTitle>
                        <Badge className="bg-amber-500">Live Data</Badge>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {painPoints.map((zone, i) => {
                            const safetyScore = zone.level === 'Critical' ? 25 : zone.level === 'High' ? 50 : zone.level === 'Moderate' ? 65 : 85;
                            return (
                            <div key={i} className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative ${i !== painPoints.length - 1 ? 'border-b' : ''}`}>
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-full ${safetyScore < 40 ? 'bg-red-100 text-red-600' : safetyScore < 70 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none">{zone.area}</div>
                                        <div className="text-xs text-slate-500 mt-1">Severity: {zone.level} • {zone.action || 'Monitor'}</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Area Assessment Score</span>
                                        <span className={safetyScore < 40 ? 'text-red-600' : safetyScore < 70 ? 'text-amber-600' : 'text-green-600'}>{safetyScore}/100</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                safetyScore < 40 ? 'bg-red-600' : safetyScore < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${safetyScore}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-slate-400 italic">
                                        Based on wait time: {zone.wait || 0} mins • Passengers: {zone.paxCount}
                                    </div>
                                </div>
                                {onRemovePainPoint && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => onRemovePainPoint(zone.id)}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-600 absolute top-4 right-4"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </div>
                        );
                        })}
                    </CardContent>
                </Card>

                {/* PEDESTRIAN RISK ZONES */}
                <Card className="shadow-lg border-none overflow-hidden border-t-4 border-t-purple-500">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" /> 
                            Pedestrian Risk Assessment
                        </CardTitle>
                        <Badge className="bg-white text-purple-600">Peak Hours</Badge>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {peakRiskZones.map((zone, i) => {
                            const riskScore = zone.riskLevel === 'Critical' ? 25 : zone.riskLevel === 'High' ? 50 : 75;
                            return (
                            <div key={zone.id} className={`p-4 md:p-6 flex flex-col gap-4 relative border-l-4 ${i !== peakRiskZones.length - 1 ? 'border-b' : ''} ${
                                zone.riskLevel === 'Critical' ? 'border-l-red-500 bg-red-50/30' :
                                zone.riskLevel === 'High' ? 'border-l-amber-500 bg-amber-50/30' :
                                'border-l-green-500 bg-green-50/30'
                            }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-full flex-shrink-0 ${riskScore < 40 ? 'bg-red-100 text-red-600' : riskScore < 70 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            <Users size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none">{zone.name}</div>
                                            <div className="flex gap-2 flex-wrap mt-3">
                                                {zone.hazards.map((hazard, idx) => (
                                                    <Badge key={idx} variant="outline" className={`text-[9px] ${
                                                        zone.riskLevel === 'Critical' ? 'border-red-400 text-red-700 bg-red-50' :
                                                        zone.riskLevel === 'High' ? 'border-amber-400 text-amber-700 bg-amber-50' :
                                                        'border-green-400 text-green-700 bg-green-50'
                                                    }`}>
                                                        • {hazard}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={`flex-shrink-0 ml-2 text-[10px] font-black ${
                                        zone.riskLevel === 'Critical' ? 'bg-red-600' :
                                        zone.riskLevel === 'High' ? 'bg-amber-600' :
                                        'bg-green-600'
                                    }`}>
                                        {zone.riskLevel}
                                    </Badge>
                                </div>
                                
                                <div className="flex flex-col gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Pedestrian Safety Score</span>
                                        <span className={riskScore < 40 ? 'text-red-600' : riskScore < 70 ? 'text-amber-600' : 'text-green-600'}>{riskScore}/100</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                riskScore < 40 ? 'bg-red-600' : riskScore < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${riskScore}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex gap-2">
                                        <span className="font-bold">Est. Pedestrians at Risk:</span>
                                        <span className={zone.riskLevel === 'Critical' ? 'text-red-600 font-black' : 'text-slate-700'}>{zone.affectedCount} people</span>
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}