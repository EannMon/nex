import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";

export default function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center space-y-1">
           <div className="flex justify-center mb-4">
             <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Activity size={24} />
             </div>
           </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Marikina Mobility</CardTitle>
          <CardDescription>LGU Operations Portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input id="email" placeholder="officer@marikina.gov.ph" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Secure Access Key</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={onLogin}>
            Access Dashboard
          </Button>
          <p className="text-center text-xs text-muted-foreground pt-2">
             Authorized Personnel Only. <br/> System monitored by Nexvision.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}