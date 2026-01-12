import { useState } from "react";
import LGUDashboard from "./components/dashboard/LGUDashboard";
import ReportsView from "./components/dashboard/ReportsView"; // Import the new component
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Menu, LayoutDashboard, AlertOctagon, FileText, LogOut, X, ShieldAlert, MapPin } from "lucide-react";

// (Keep your Login Mock Data and RiskPriorityList same as before...)
const riskPriorityList = [ /* ... same as previous prompt ... */ ];

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState<"dashboard" | "risk" | "reports">("dashboard"); // Added "reports"
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = (view: "dashboard" | "risk" | "reports") => {
        setCurrentView(view);
        setIsMenuOpen(false);
    };

    if (!isLoggedIn) {
        // ... (Keep existing Login Page code) ...
        return (
             <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
                <Card className="w-full max-w-sm border-slate-800 bg-slate-900 text-white shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50">
                            <Activity className="text-white h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Marikina Mobility</CardTitle>
                        <CardDescription className="text-slate-400">LGU Operations Portal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Official ID</Label>
                            <Input placeholder="Enter Officer ID" className="bg-slate-800 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Access Key</Label>
                            <Input type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700" />
                        </div>
                        <Button onClick={() => setIsLoggedIn(true)} className="w-full bg-blue-600 hover:bg-blue-500 font-bold">
                            Enter Portal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-0 md:p-6 lg:p-8">
            <div className="w-full max-w-[1200px] h-[100dvh] md:h-[90vh] bg-background md:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-200 dark:border-slate-800">
                
                {/* HAMBURGER (Fixed Top Right) */}
                <div className="absolute top-0 right-0 z-[500] p-4 pointer-events-none flex justify-end">
                    <Button 
                        size="icon" variant="secondary" 
                        className="pointer-events-auto shadow-xl rounded-full h-12 w-12 bg-white/90 backdrop-blur text-slate-900 hover:bg-white hover:scale-105 transition-all"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>

                {/* MENU OVERLAY */}
                {isMenuOpen && (
                    <div className="absolute inset-0 z-[600] bg-black/60 backdrop-blur-sm flex justify-end">
                        <div className="w-[300px] h-full bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in slide-in-from-right-10 duration-200 flex flex-col border-l">
                            <div className="flex items-center justify-between mb-8 border-b pb-4">
                                <div className="font-bold text-lg flex items-center gap-2"><Activity className="text-blue-600"/> Menu</div>
                                <Button size="icon" variant="ghost" onClick={() => setIsMenuOpen(false)}><X className="h-5 w-5" /></Button>
                            </div>
                            <nav className="flex flex-col gap-2 flex-1">
                                <Button variant={currentView === 'dashboard' ? 'default' : 'ghost'} className="justify-start gap-3 w-full h-12" onClick={() => navigate('dashboard')}>
                                    <LayoutDashboard className="h-5 w-5" /> Live Dashboard
                                </Button>
                                <Button variant={currentView === 'risk' ? 'default' : 'ghost'} className="justify-start gap-3 w-full h-12" onClick={() => navigate('risk')}>
                                    <AlertOctagon className="h-5 w-5" /> Risk Analysis
                                </Button>
                                {/* ENABLED REPORTS BUTTON */}
                                <Button variant={currentView === 'reports' ? 'default' : 'ghost'} className="justify-start gap-3 w-full h-12" onClick={() => navigate('reports')}>
                                    <FileText className="h-5 w-5" /> Reports & Logs
                                </Button>
                            </nav>
                            {/* ... Footer ... */}
                        </div>
                    </div>
                )}

                {/* CONTENT AREA */}
                <main className="flex-1 relative z-0 h-full">
                    {currentView === 'dashboard' && <LGUDashboard />}
                    {currentView === 'reports' && <ReportsView />} {/* NEW VIEW */}
                    
                    {currentView === 'risk' && (
                        // (Same Risk View Code as previous prompt...)
                        <div className="h-full overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                             {/* ... paste the Risk Analysis Code from previous prompt here ... */}
                             <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-red-100 rounded-lg text-red-600">
                                        <AlertOctagon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Risk Analysis Report</h2>
                                        <p className="text-muted-foreground">Real-time incident priority queue</p>
                                    </div>
                                </div>
                                {/* Content... */}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}