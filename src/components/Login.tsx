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
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react"; // Imported from your second component

// Assuming you might want to keep the User type flexibility for future use
// If not using the actual auth logic yet, we can keep the simple onLogin prop
interface LoginProps {
    onLogin: () => void; 
}

export default function Login({ onLogin }: LoginProps) {
    const [loginType, setLoginType] = useState<"passenger" | "operator">("operator"); // Defaulted to operator based on context
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // Simple validation for the UI demo
        if (formData.email && formData.password) {
            onLogin();
        } else {
            setError("Please enter your credentials to proceed.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <Card className="w-full max-w-md shadow-xl" size="sm">
                <CardHeader className="space-y-1">
                    {/* Branding Icon from Second Component */}
                    <div className="flex justify-center mb-2">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <Activity size={20} />
                        </div>
                    </div>
                    
                    {/* Titles from Second Component */}
                    <CardTitle className="text-xl font-bold text-center text-blue-950">
                        Marikina Mobility
                    </CardTitle>
                    <CardDescription className="text-center text-xs">
                        LGU Operations Portal
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {/* Login Type Toggle (From First Component - Good feature to keep!) */}
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        <button
                            type="button"
                            onClick={() => setLoginType("passenger")}
                            className={cn(
                                "flex-1 rounded-md px-4 py-2 text-xs font-medium transition-all",
                                loginType === "passenger"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Public Access
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType("operator")}
                            className={cn(
                                "flex-1 rounded-md px-4 py-2 text-xs font-medium transition-all",
                                loginType === "operator"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Official Login
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium">
                                {loginType === 'operator' ? 'Official Email' : 'Email Address'}
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={loginType === 'operator' ? "officer@marikina.gov.ph" : "juandelacruz@gmail.com"}
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="h-9 text-sm bg-slate-50/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-medium">
                                    {loginType === 'operator' ? 'Secure Access Key' : 'Password'}
                                </Label>
                                <button
                                    type="button"
                                    className="text-[10px] text-blue-600 hover:underline font-medium"
                                >
                                    Forgot key?
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
                                className="h-9 text-sm bg-slate-50/50"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-blue-700 hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10" 
                            size="sm"
                        >
                            Access Dashboard
                        </Button>
                    </form>

                    {/* Footer Text from Second Component */}
                    <div className="relative pt-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                System Status
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-muted-foreground leading-tight">
                        Authorized Personnel Only.<br/>
                        <span className="opacity-70">System monitored by Nexvision.</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}