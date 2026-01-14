import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, Zap, Info, ArrowUpRight, Timer, Activity, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PainPoint } from "@/components/MainLayout";

export default function CommuterPainPoints({ 
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
                            <Users className="text-blue-600 h-8 w-8" /> 
                            Commuter Pain Points
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base tracking-tight">Real-time analysis of passenger density and transit delays.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 text-blue-700 animate-pulse">
                        <Zap className="h-3 w-3 mr-1 fill-blue-600" /> LIVE MOBILITY INTEL
                    </Badge>
                </div>

                {/* VISUALIZATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {painPoints.map((point) => (
                        <Card key={point.id} className={`border-t-4 shadow-sm hover:shadow-md transition-all relative ${
                            point.level === 'Critical' ? 'border-t-red-600' : 
                            point.level === 'High' ? 'border-t-orange-500' : 
                            point.level === 'Moderate' ? 'border-t-blue-500' : 'border-t-green-500'
                        }`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={point.level === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px] font-bold">
                                        {point.level.toUpperCase()}
                                    </Badge>
                                    {onRemovePainPoint && (
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            onClick={() => onRemovePainPoint(point.id)}
                                            className="h-5 w-5 p-0 text-slate-400 hover:text-red-600"
                                        >
                                            <X size={12} />
                                        </Button>
                                    )}
                                </div>
                                <Clock className={`h-4 w-4 mt-2 ${point.level === 'Critical' ? 'text-red-500' : 'text-slate-400'}`} />
                                <CardTitle className="text-lg font-bold mt-2">{point.area}</CardTitle>
                                <CardDescription className="text-xs font-semibold text-slate-600 dark:text-slate-400">{point.type}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-3">
                                <div className="text-[11px] leading-tight text-muted-foreground bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <strong>Context:</strong> {point.affected}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                                    <Timer className="h-3 w-3" />
                                    {point.status}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* DETAILED WAIT-TIME ANALYTICS */}
                <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-4 md:p-6">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-400" /> 
                                High-Density Surge Zones
                            </div>
                            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Updated 1m ago</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {painPoints.map((point, i) => (
                            <div key={i} className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 relative ${i !== painPoints.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-2 min-w-[60px]">
                                        <span className="text-xs font-bold text-slate-500 uppercase">PAX</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">{point.paxCount}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                                            {point.area}
                                            {point.trend === 'Rising' && <ArrowUpRight className="h-4 w-4 text-red-500" />}
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <MapPin size={12} /> {point.type}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Passenger Load Simulation */}
                                <div className="flex flex-col gap-1.5 w-full md:w-1/3">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                        <span>Terminal Saturation</span>
                                        <span className={point.level === 'Critical' ? 'text-red-600' : point.level === 'High' ? 'text-orange-600' : 'text-blue-600'}>
                                            {point.level === 'Critical' ? 'High Load' : point.level === 'High' ? 'Moderate' : 'Manageable'}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                point.level === 'Critical' ? 'bg-red-600' : 
                                                point.level === 'High' ? 'bg-orange-500' : 
                                                point.level === 'Moderate' ? 'bg-blue-600' :
                                                'bg-green-600'
                                            }`} 
                                            style={{ width: point.level === 'Critical' ? '88%' : point.level === 'High' ? '65%' : point.level === 'Moderate' ? '40%' : '20%' }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-slate-400 italic">
                                        {point.action || "Recommendation: Monitor situation"}
                                    </div>
                                </div>
                                {onRemovePainPoint && (
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => onRemovePainPoint(point.id)}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-600 absolute top-4 right-4"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Legend/Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <Info className="text-blue-600 h-5 w-5 shrink-0" />
                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                            <strong>Note:</strong> Data is aggregated from anonymous GPS signals and mobility sensors located at major Marikina intermodal hubs.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}