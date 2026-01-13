import { useState } from "react";

// --- COMPONENT IMPORTS ---
import LGUDashboard from "@/components/dashboard/LGUDashboard";
import CommuterPainPoints from "@/components/dashboard/CommuterPainPoints";
import ReportsView from "@/components/dashboard/ReportsView"; 
// ADD THESE NEW IMPORTS:
import CongestionAnalytics from "@/components/dashboard/CongestionAnalytics";
import PeakZoneAnalysis from "@/components/dashboard/PeakZoneAnalysis";
import LoginForm from "./components/auth/LoginForm"; 

// --- UI IMPORTS ---
import { Button } from "@/components/ui/button";

// --- DATA/TYPE IMPORTS ---
import { type User } from "@/data/users"; 

// --- ICON IMPORTS ---
import { 
    Activity, 
    Menu, 
    LayoutDashboard, 
    AlertOctagon, 
    FileText, 
    LogOut, 
    X,
    Navigation, // Imported for Congestion
    Clock       // Imported for Peak Zones
} from "lucide-react";

// 1. UPDATE STATE TYPE: Add "congestion" and "peak"
type ViewState = "dashboard" | "pain-points" | "reports" | "congestion" | "peak";

export default function App() {
    const [user, setUser] = useState<User | null>(null); 
    const [currentView, setCurrentView] = useState<ViewState>("dashboard");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogin = (authenticatedUser: User) => setUser(authenticatedUser);

    const handleNavigation = (view: ViewState) => {
        setCurrentView(view);
        setIsMenuOpen(false); 
    };

    const handleLogout = () => {
        setUser(null);
        setIsMenuOpen(false);
        setCurrentView("dashboard");
    };

    if (!user) return <LoginForm onLogin={handleLogin} />;

    return (
        <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-0 md:p-6 lg:p-8 transition-all duration-300 font-sans">
            <div className="w-full max-w-[1400px] h-[100dvh] md:h-[90vh] bg-background md:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800">
                
                {/* --- FLOATING MENU TRIGGER --- */}
                <div className="absolute top-4 right-4 z-[500] pointer-events-none">
                    <Button 
                        size="icon" 
                        className="focus-visible:border-ring focus-visible:ring-ring/50 border border-transparent pointer-events-auto shadow-xl rounded-full h-10 w-10 md:h-12 md:w-12 bg-white/90 backdrop-blur text-slate-900 hover:bg-white hover:scale-105 transition-all"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </Button>
                </div>

                {/* --- NAVIGATION MENU OVERLAY --- */}
                {isMenuOpen && (
                    <div className="absolute inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
                        <div className="w-[85%] max-w-[320px] h-full bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-100 dark:border-slate-800 overflow-y-auto">
                            
                            <div className="flex items-center justify-between mb-8 border-b pb-6">
                                <div className="flex flex-col">
                                    <span className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
                                        <Activity className="text-blue-600 h-6 w-6"/> Intel Portal
                                    </span>
                                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Hello, {user.name}</span>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setIsMenuOpen(false)} className="rounded-full hover:bg-slate-100">
                                    <X className="h-6 w-6 text-slate-400" />
                                </Button>
                            </div>

                            <nav className="flex flex-col gap-3 flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1">Command & Analytics</p>
                                
                                <Button 
                                    variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
                                    className={`justify-start gap-4 h-14 rounded-xl text-sm font-bold ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50'}`}
                                    onClick={() => handleNavigation('dashboard')}
                                >
                                    <LayoutDashboard size={20} /> Command Center
                                </Button>

                                <Button 
                                    variant={currentView === 'pain-points' ? 'default' : 'ghost'} 
                                    className={`justify-start gap-4 h-14 rounded-xl text-sm font-bold ${currentView === 'pain-points' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50'}`} 
                                    onClick={() => handleNavigation('pain-points')}
                                >
                                    <AlertOctagon size={20} /> Pain Points
                                </Button>

                                {/* 2. NEW NAVIGATION BUTTONS */}
                                <Button 
                                    variant={currentView === 'congestion' ? 'default' : 'ghost'} 
                                    className={`justify-start gap-4 h-14 rounded-xl text-sm font-bold ${currentView === 'congestion' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50'}`} 
                                    onClick={() => handleNavigation('congestion')}
                                >
                                    <Navigation size={20} /> Congestion Analytics
                                </Button>

                                <Button 
                                    variant={currentView === 'peak' ? 'default' : 'ghost'} 
                                    className={`justify-start gap-4 h-14 rounded-xl text-sm font-bold ${currentView === 'peak' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50'}`} 
                                    onClick={() => handleNavigation('peak')}
                                >
                                    <Clock size={20} /> Peak Zone Intel
                                </Button>

                            </nav>

                            <div className="mt-auto space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Button 
                                    variant="destructive" 
                                    className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-red-600/10" 
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} /> Sign Out
                                </Button>
                                
                                {/* --- BRANDING FOOTER --- */}
                                <div className="text-center leading-relaxed">
                                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        City of Marikina
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 italic">
                                        in partnership with <span className="text-blue-600 dark:text-blue-400 font-semibold not-italic">Nexstation</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. DYNAMIC CONTENT AREA: Add the new views here */}
                <main className="flex-1 relative z-0 h-full w-full overflow-hidden">
                    {currentView === 'dashboard' && <LGUDashboard />}
                    {currentView === 'pain-points' && <CommuterPainPoints />}
                    {currentView === 'congestion' && <CongestionAnalytics />}
                    {currentView === 'peak' && <PeakZoneAnalysis />}
                    {currentView === 'reports' && <ReportsView />}
                </main>

            </div>
        </div>
    );
}