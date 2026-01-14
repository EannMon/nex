import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Gauge, TrendingDown, Zap, Activity, Car, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PainPoint } from "@/components/MainLayout";

export default function CongestionAnalytics({ 
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
                            <Navigation className="text-indigo-600 h-8 w-8" /> 
                            Congestion Analytics
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base tracking-tight">Real-time traffic velocity and road network efficiency.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-indigo-200 bg-indigo-50 text-indigo-700 animate-pulse">
                        <Gauge className="h-3 w-3 mr-1" /> VELOCITY TRACKING ACTIVE
                    </Badge>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {painPoints.map((item) => (
                        <Card key={item.id} className={`border-t-4 shadow-sm transition-all relative ${
                            item.level === 'Critical' ? 'border-t-red-600' : 
                            item.level === 'High' ? 'border-t-orange-500' : 
                            'border-t-emerald-500'
                        }`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={item.level === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">
                                        {item.level.toUpperCase()}
                                    </Badge>
                                    {onRemovePainPoint && (
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => onRemovePainPoint(item.id)}
                                            className="h-5 w-5 p-0 text-slate-400 hover:text-red-600"
                                        >
                                            <X size={12} />
                                        </Button>
                                    )}
                                </div>
                                <Car className="h-4 w-4 text-slate-400 mt-2" />
                                <CardTitle className="text-lg font-bold mt-2">{item.area}</CardTitle>
                                <CardDescription className="text-xs font-semibold text-indigo-600">{item.type}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-3">
                                <div className="text-[11px] text-muted-foreground bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                    <strong>Wait Time:</strong> {item.wait || 0} mins
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <TrendingDown className="h-3 w-3" />
                                    Trend: {item.trend}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* NETWORK THROUGHPUT TABLE */}
                <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className="bg-indigo-950 text-white p-4 md:p-6">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-400" /> 
                            Network Congestion Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {painPoints.map((item, i) => (
                            <div key={i} className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${i !== painPoints.length - 1 ? 'border-b' : ''}`}>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-700">
                                        <span className="text-[10px] font-bold">WAIT</span>
                                        <span className="text-sm font-black">{item.wait || 0}m</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{item.area}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            {item.type} <ArrowRight size={10}/> {item.level}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 w-full md:w-1/3">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                                        <span>Congestion Level</span>
                                        <span>{item.level === 'Critical' ? '85%' : item.level === 'High' ? '65%' : item.level === 'Moderate' ? '40%' : '15%'}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                item.level === 'Critical' ? 'bg-red-500' : item.level === 'High' ? 'bg-orange-500' : item.level === 'Moderate' ? 'bg-yellow-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: item.level === 'Critical' ? '85%' : item.level === 'High' ? '65%' : item.level === 'Moderate' ? '40%' : '15%' }}
                                        />
                                    </div>
                                </div>
                                {onRemovePainPoint && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => onRemovePainPoint(item.id)}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-600 absolute top-4 right-4"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}