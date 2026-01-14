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

interface MainLayoutProps {
    user: User;
    onLogout: () => void;
}

const viewConfig: Record<ViewState, { label: string; icon: React.ReactNode; component: React.ComponentType }> = {
    dashboard: { label: "Command Center", icon: <LayoutDashboard size={20} />, component: LGUDashboard },
    "pain-points": { label: "Pain Points", icon: <AlertOctagon size={20} />, component: CommuterPainPoints },
    congestion: { label: "Congestion Analytics", icon: <Navigation size={20} />, component: CongestionAnalytics },
    peak: { label: "Peak Zone Intel", icon: <Clock size={20} />, component: PeakZoneAnalysis },
    reports: { label: "Incident Reports", icon: <FileText size={20} />, component: ReportsView },
};

export default function MainLayout({ user, onLogout }: MainLayoutProps) {
    const [currentView, setCurrentView] = useState<ViewState>("dashboard");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (view: ViewState) => {
        setCurrentView(view);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        onLogout();
    };

    const CurrentComponent = viewConfig[currentView].component;

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
                <CurrentComponent />
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
