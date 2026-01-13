import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Gauge, TrendingDown, MapPin, Zap, Info, Activity, Car, ArrowRight } from "lucide-react";

const congestionData = [
    { id: 1, road: "Sumulong Highway", status: "Gridlock", speed: "5 kph", trend: "Stagnant", volume: "Heavy", delay: "+22 mins", throughput: 12 },
    { id: 2, road: "Marcos Highway", status: "Slow", speed: "18 kph", trend: "Improving", volume: "Moderate", delay: "+10 mins", throughput: 45 },
    { id: 3, road: "Gil Fernando Ave", status: "Flowing", speed: "45 kph", trend: "Stable", volume: "Light", delay: "No Delay", throughput: 88 },
    { id: 4, road: "J.P. Rizal St", status: "Congested", speed: "12 kph", trend: "Worsening", volume: "Heavy", delay: "+15 mins", throughput: 25 },
];

export default function CongestionAnalytics() {
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
                    {congestionData.map((item) => (
                        <Card key={item.id} className={`border-t-4 shadow-sm transition-all ${
                            item.status === 'Gridlock' ? 'border-t-red-600' : 
                            item.status === 'Congested' ? 'border-t-orange-500' : 
                            'border-t-emerald-500'
                        }`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={item.status === 'Gridlock' ? 'destructive' : 'outline'} className="text-[10px]">
                                        {item.status.toUpperCase()}
                                    </Badge>
                                    <Car className="h-4 w-4 text-slate-400" />
                                </div>
                                <CardTitle className="text-lg font-bold mt-2">{item.road}</CardTitle>
                                <CardDescription className="text-xs font-semibold text-indigo-600">{item.speed} avg speed</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-3">
                                <div className="text-[11px] text-muted-foreground bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                                    <strong>Delay:</strong> {item.delay}
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
                            Network Throughput Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-slate-900">
                        {congestionData.map((item, i) => (
                            <div key={i} className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${i !== congestionData.length - 1 ? 'border-b' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-700">
                                        <span className="text-[10px] font-bold">KM/H</span>
                                        <span className="text-sm font-black">{item.speed.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{item.road}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            Volume: {item.volume} <ArrowRight size={10}/> {item.status}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 w-full md:w-1/3">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                                        <span>Flow Efficiency</span>
                                        <span>{item.throughput}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                item.throughput < 30 ? 'bg-red-500' : item.throughput < 60 ? 'bg-orange-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${item.throughput}%` }}
                                        />
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