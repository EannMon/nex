import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Activity, LayoutDashboard, AlertOctagon, Navigation, Clock, FileText, LogOut, X } from "lucide-react";
import LGUDashboard from "@/components/dashboard/LGUDashboard";
import CommuterPainPoints from "@/components/dashboard/CommuterPainPoints";
import CongestionAnalytics from "@/components/dashboard/CongestionAnalytics";
import PeakZoneAnalysis from "@/components/dashboard/PeakZoneAnalysis";
import ReportsView from "@/components/dashboard/ReportsView";
import type { User } from "@/data/users";

type ViewState = "dashboard" | "pain-points" | "reports" | "congestion" | "peak";

export interface PainPoint {
    id: number;
    area: string;
    type: string;
    level: "Critical" | "High" | "Moderate" | "Low";
    trend: string;
    affected: string;
    status: string;
    paxCount: number;
    lat: number;
    lng: number;
    radius: number;
    wait: number;
    action: string;
}

interface MainLayoutProps {
    user: User;
    onLogout: () => void;
}

const viewConfig: Record<ViewState, { label: string; icon: React.ReactNode; component: React.ComponentType<any> }> = {
    dashboard: { label: "Command Center", icon: <LayoutDashboard size={20} />, component: LGUDashboard },
    "pain-points": { label: "Pain Points", icon: <AlertOctagon size={20} />, component: CommuterPainPoints },
    congestion: { label: "Congestion Analytics", icon: <Navigation size={20} />, component: CongestionAnalytics },
    peak: { label: "Peak Zone Intel", icon: <Clock size={20} />, component: PeakZoneAnalysis },
    reports: { label: "Incident Reports", icon: <FileText size={20} />, component: ReportsView },
};

// Merged Data: This serves as both the Heatmap data source AND the Pain Points list
const defaultPainPoints: PainPoint[] = [
    { 
        id: 1, area: "Marikina Bayan", lat: 14.6335, lng: 121.0955, paxCount: 520, wait: 45, radius: 675, 
        type: "Passenger Surge", level: "Critical", trend: "Rising", affected: "UV Express / Jeepney Terminal", status: "Wait > 45 mins", action: "Dispatch Traffic Enforcers" 
    },
    { 
        id: 2, area: "Riverbanks Center", lat: 14.6300, lng: 121.0880, paxCount: 410, wait: 35, radius: 525, 
        type: "Queue Spillover", level: "Critical", trend: "Rising", affected: "Public Transport Hub", status: "Wait > 35 mins", action: "Monitor Queue Length" 
    },
    { 
        id: 3, area: "Barangka Flyover", lat: 14.6285, lng: 121.0825, paxCount: 440, wait: 40, radius: 600, 
        type: "Chokepoint", level: "Critical", trend: "Stable", affected: "Merging Lane", status: "Traffic Buildup", action: "Check Merging Lane" 
    },
    { 
        id: 4, area: "LRT-2 Santolan Station", lat: 14.6220, lng: 121.0850, paxCount: 480, wait: 32, radius: 480, 
        type: "Intermodal Bottleneck", level: "High", trend: "Stable", affected: "Eastbound Loading Zone", status: "Heavy Volume", action: "Coord with LRTA" 
    },
    { 
        id: 5, area: "Concepcion Uno", lat: 14.6515, lng: 121.1040, paxCount: 390, wait: 28, radius: 420, 
        type: "Loading Violation", level: "High", trend: "Stable", affected: "Market Area", status: "Congested", action: "Clear Market Entrance" 
    },
    { 
        id: 6, area: "SM Marikina Area", lat: 14.6250, lng: 121.0910, paxCount: 310, wait: 25, radius: 375, 
        type: "Mall Traffic", level: "Moderate", trend: "Decreasing", affected: "Transport Terminal", status: "Moderate Queue", action: "Monitor Mall Traffic" 
    },
    { 
        id: 7, area: "Marcos Hwy - Gil Fernando", lat: 14.6232, lng: 121.1000, paxCount: 350, wait: 22, radius: 330, 
        type: "Intersection Block", level: "Moderate", trend: "Stable", affected: "Major Intersection", status: "Signal Timing Issue", action: "Adjust Signal Timing" 
    },
    { 
        id: 8, area: "Tumana Bridge Access", lat: 14.6480, lng: 121.0995, paxCount: 210, wait: 18, radius: 270, 
        type: "Narrow Access", level: "Moderate", trend: "Rising", affected: "Bridge Entry", status: "Slow Moving", action: "Flood Watch Required" 
    },
    { 
        id: 9, area: "Parang-Fortune Jct", lat: 14.6610, lng: 121.1150, paxCount: 220, wait: 15, radius: 225, 
        type: "School Zone", level: "Moderate", trend: "Decreasing", affected: "School Exits", status: "Student Surge", action: "School Zone Alert" 
    },
    { 
        id: 10, area: "Kalumpang (J.P. Rizal)", lat: 14.6200, lng: 121.0920, paxCount: 190, wait: 14, radius: 210, 
        type: "Flowing", level: "Low", trend: "Stable", affected: "Local Road", status: "Normal", action: "No Action Needed" 
    },
    { 
        id: 11, area: "Marikina Heights (NGI)", lat: 14.6465, lng: 121.1120, paxCount: 250, wait: 12, radius: 180, 
        type: "Terminal Queue", level: "Low", trend: "Stable", affected: "Tricycle/Jeep Terminal", status: "Organized", action: "Monitor Tricycle Terminal" 
    },
    { 
        id: 12, area: "Concepcion Dos (Lilac St)", lat: 14.6390, lng: 121.1150, paxCount: 180, wait: 9, radius: 135, 
        type: "Commercial Strip", level: "Low", trend: "Stable", affected: "Dining Area", status: "Light Traffic", action: "Check Illegal Parking" 
    },
    { 
        id: 13, area: "Fortune Barangay Hall", lat: 14.6680, lng: 121.1230, paxCount: 140, wait: 7, radius: 105, 
        type: "Local Traffic", level: "Low", trend: "Decreasing", affected: "Barangay Road", status: "Clear", action: "No Action Needed" 
    },
    { 
        id: 14, area: "SSS Village (Panorama)", lat: 14.6360, lng: 121.1250, paxCount: 130, wait: 5, radius: 75, 
        type: "Residential Access", level: "Low", trend: "Stable", affected: "Gate Entrance", status: "Clear", action: "No Action Needed" 
    }
];

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
    const [currentView, setCurrentView] = useState<ViewState>("dashboard");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [painPoints, setPainPoints] = useState<PainPoint[]>(defaultPainPoints);

    const handleAddPainPoint = (newPainPoint: Omit<PainPoint, "id">) => {
        const newId = Math.max(...painPoints.map(p => p.id), 0) + 1;
        setPainPoints([...painPoints, { ...newPainPoint, id: newId }]);
    };

    const handleRemovePainPoint = (id: number) => {
        setPainPoints(painPoints.filter(p => p.id !== id));
    };

    const handleNavigation = (view: ViewState) => {
        setCurrentView(view);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        onLogout();
    };

    const CurrentComponent = viewConfig[currentView].component;

    const getComponentProps = () => {
        if (currentView === "dashboard") {
            return { painPoints, onAddPainPoint: handleAddPainPoint, onRemovePainPoint: handleRemovePainPoint };
        }
        if (currentView === "pain-points") {
            return { painPoints, onRemovePainPoint: handleRemovePainPoint };
        }
        if (currentView === "congestion") {
            return { painPoints, onRemovePainPoint: handleRemovePainPoint };
        }
        if (currentView === "peak") {
            return { painPoints, onRemovePainPoint: handleRemovePainPoint };
        }
        return {};
    };

    return (
        <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
            {/* Header */}
            <header className="border-b bg-card flex-shrink-0">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Activity className="text-blue-600 h-6 w-6" />
                            Marikina Intel
                        </h1>
                        <p className="text-xs text-muted-foreground">LGU Operations Portal</p>
                    </div>
                    <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                <CurrentComponent {...getComponentProps()} />
            </main>

            {/* Navigation Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
                    <div className="w-[85%] max-w-[320px] h-full bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border overflow-y-auto">
                        
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-primary flex items-center gap-2">
                                    <Activity className="text-blue-600 h-5 w-5" />
                                    Menu
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">{user.name}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setIsMenuOpen(false)} className="rounded-lg">
                                <X className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <nav className="flex flex-col gap-1 flex-1 p-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Navigation</p>
                            
                            {(Object.entries(viewConfig) as [ViewState, typeof viewConfig[ViewState]][]).map(([view, config]) => (
                                <Button 
                                    key={view}
                                    variant={currentView === view ? 'default' : 'ghost'} 
                                    className={`justify-start gap-3 h-12 rounded-lg text-sm font-medium ${
                                        currentView === view 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                    onClick={() => handleNavigation(view)}
                                >
                                    {config.icon} 
                                    <span>{config.label}</span>
                                </Button>
                            ))}
                        </nav>

                        <div className="space-y-3 p-4 border-t">
                            <Button 
                                variant="destructive" 
                                className="w-full gap-2 font-medium" 
                                onClick={handleLogout}
                            >
                                <LogOut size={16} /> 
                                Sign Out
                            </Button>
                            
                            <div className="text-center space-y-1 pt-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    City of Marikina
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Powered by <span className="font-semibold text-primary">Nexstation</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}