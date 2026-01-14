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
            setError("Invalid email, password, or account type. Please try again.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        LGU Operations
                    </CardTitle>
                    <CardDescription className="text-center text-xs">
                        Sign in to Marikina Intel
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs">
                                Official Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@marikina.gov.ph"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="h-8 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs">
                                    Password
                                </Label>
                                <button
                                    type="button"
                                    className="text-[10px] text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="h-8 text-sm"
                            />
                        </div>

                        <Button type="submit" className="w-full" size="sm">
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Helper */}
                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => setFormData({email: "admin@marikina.gov.ph", password: "Marikina2026"})}
                            className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                        >
                            Fill demo credentials
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Authorized personnel only
                            </span>
                        </div>
                    </div>

                    <div className="text-center space-y-1.5">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            City of Marikina
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Powered by <span className="font-medium text-primary">Nexstation</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}