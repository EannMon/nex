import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export default function LoginForm({ onLogin }: { onLogin: (user: any) => void }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        // Hardcoded Prototype Credentials
        if (formData.email === "admin@marikina.gov.ph" && formData.password === "Marikina2026") {
            onLogin({ name: "LGU Admin", role: "lgu" });
        } else {
            setError("Invalid official credentials.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-blue-700">
                <CardHeader className="text-center space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="h-14 w-14 bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={28} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        Marikina Mobility
                    </CardTitle>
                    <CardDescription className="font-medium text-blue-600/80 uppercase tracking-tight text-[10px]">
                        Official LGU Operations Portal
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-2 text-[11px] font-medium text-center bg-red-50 text-red-600 rounded border border-red-100 animate-in fade-in zoom-in duration-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase text-slate-500">Official Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@marikina.gov.ph"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" text-xs text-slate-500>Secure Access Key</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold" size="lg">
                            Authorize & Access
                        </Button>
                    </form>

                    {/* Developer Helper for testing */}
                    <div className="text-center">
                        <button 
                            onClick={() => setFormData({email: "admin@marikina.gov.ph", password: "Marikina2026"})}
                            className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            (Fill demo credentials)
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-center text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60">
                            Authorized Personnel Only <br/>
                            Managed by Nexvision
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}