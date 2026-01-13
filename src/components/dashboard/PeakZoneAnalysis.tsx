import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, ShieldCheck, MapPin, Zap, Info, Calendar, Timer, History } from "lucide-react";

const peakZones = [
    { id: 1, area: "Barangka Flyover", window: "5:00 PM - 8:00 PM", risk: "Extreme", factor: "Merge Conflict", incidentRate: "High", safetyScore: 24 },
    { id: 2, area: "Sumulong (Bayan)", window: "7:00 AM - 9:00 AM", risk: "High", factor: "Pedestrian Volume", incidentRate: "Moderate", safetyScore: 45 },
    { id: 3, area: "Marcos Hwy Bridge", window: "4:30 PM - 7:30 PM", risk: "Extreme", factor: "Bottlenecking", incidentRate: "High", safetyScore: 18 },
    { id: 4, area: "Tumana Bridge", window: "6:00 AM - 8:30 AM", risk: "Moderate", factor: "One-Way Enforcement", incidentRate: "Low", safetyScore: 72 },
];

export default function PeakZoneAnalysis() {
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
                    {peakZones.map((zone) => (
                        <Card key={zone.id} className="border-l-4 border-l-amber-500 shadow-sm hover:translate-y-[-2px] transition-all">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter flex items-center gap-1">
                                        <Timer size={10}/> Peak Window
                                    </span>
                                    <Badge variant={zone.risk === 'Extreme' ? 'destructive' : 'secondary'} className="text-[9px]">
                                        {zone.risk}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold mt-2">{zone.area}</CardTitle>
                                <CardDescription className="text-xs font-medium flex items-center gap-1 text-slate-500">
                                    <Calendar size={12}/> {zone.window}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-[11px] p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                                    <strong>Primary Factor:</strong> {zone.factor}
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
                            Peak-Hour Safety Index
                        </CardTitle>
                        <Badge className="bg-amber-500">Live Forecast</Badge>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {peakZones.map((zone, i) => (
                            <div key={i} className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${i !== peakZones.length - 1 ? 'border-b' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${zone.safetyScore < 30 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none">{zone.area}</div>
                                        <div className="text-xs text-slate-500 mt-1">Incident Rate: {zone.incidentRate} • {zone.window}</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 w-full md:w-1/2">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Area Safety Score</span>
                                        <span className={zone.safetyScore < 30 ? 'text-red-600' : 'text-amber-600'}>{zone.safetyScore}/100</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                zone.safetyScore < 30 ? 'bg-red-600' : zone.safetyScore < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${zone.safetyScore}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-slate-400 italic">
                                        Data based on historical incident density during this time window.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}