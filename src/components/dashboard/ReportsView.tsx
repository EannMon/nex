import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const logs = [
    { id: "LOG-001", time: "10:42 AM", type: "Incident", location: "Barangka Flyover", details: "Vehicle Collision reported by User #992", status: "Resolved" },
    { id: "LOG-002", time: "10:30 AM", type: "System", location: "Marikina Bayan", details: "Crowd density threshold exceeded (>400)", status: "Alert Sent" },
    { id: "LOG-003", time: "09:15 AM", type: "Traffic", location: "Marcos Hwy", details: "Gridlock detected via GPS Velocity", status: "Monitoring" },
    { id: "LOG-004", time: "08:00 AM", type: "Maintenance", location: "Tumana Bridge", details: "Scheduled structural inspection", status: "Ongoing" },
    { id: "LOG-005", time: "07:45 AM", type: "User Report", location: "Riverbanks", details: "Slippery walkway reported", status: "Pending" },
];

export default function ReportsView() {
    return (
        <div className="h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="text-blue-600" /> Operational Logs
                        </h2>
                        <p className="text-muted-foreground text-sm">Historical data from User GPS & Incident Reports</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"/> Export CSV</Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search logs..." className="pl-8 bg-white" />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>

                {/* Data Table (Card Style) */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-slate-100/50 py-3">
                        <div className="grid grid-cols-12 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <div className="col-span-2">Time</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-3">Location</div>
                            <div className="col-span-3">Details</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {logs.map((log, i) => (
                            <div key={log.id} className={`grid grid-cols-12 gap-2 p-4 text-sm items-center hover:bg-slate-50 transition-colors ${i !== logs.length - 1 ? 'border-b' : ''}`}>
                                <div className="col-span-2 font-mono text-xs text-slate-500">{log.time}</div>
                                <div className="col-span-2">
                                    <Badge variant="outline" className="font-normal">{log.type}</Badge>
                                </div>
                                <div className="col-span-3 font-medium">{log.location}</div>
                                <div className="col-span-3 text-muted-foreground truncate" title={log.details}>{log.details}</div>
                                <div className="col-span-2 text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                        ${log.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                                          log.status === 'Alert Sent' ? 'bg-red-100 text-red-700' : 
                                          'bg-blue-100 text-blue-700'}`}>
                                        {log.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}