"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Video, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Line, LineChart, YAxis } from "recharts";

const data = [
    { name: "Seg", views: 4000, revenue: 240 },
    { name: "Ter", views: 3000, revenue: 198 },
    { name: "Qua", views: 2000, revenue: 150 },
    { name: "Qui", views: 2780, revenue: 200 },
    { name: "Sex", views: 1890, revenue: 120 },
    { name: "Sáb", views: 2390, revenue: 170 },
    { name: "Dom", views: 3490, revenue: 210 },
];

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Métricas</h1>
                <p className="text-muted-foreground">Desempenho da TV Facebrasil em tempo real.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Visualizações Totais"
                    value="124.5k"
                    change="+12.5%"
                    trend="up"
                    icon={<Video className="w-4 h-4 text-primary" />}
                />
                <StatCard
                    title="Novos Inscritos"
                    value="1,234"
                    change="+18.2%"
                    trend="up"
                    icon={<Users className="w-4 h-4 text-primary" />}
                />
                <StatCard
                    title="Receita Estimada"
                    value="$3,450.00"
                    change="-2.4%"
                    trend="down"
                    icon={<DollarSign className="w-4 h-4 text-primary" />}
                />
                <StatCard
                    title="Taxa de Retenção"
                    value="64%"
                    change="+4.1%"
                    trend="up"
                    icon={<TrendingUp className="w-4 h-4 text-primary" />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Visualizações por Dia</CardTitle>
                        <CardDescription>Tráfego orgânico vs direto na última semana.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Receita de Assinaturas</CardTitle>
                        <CardDescription>Crescimento de receita recorrente (Premium).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Cost Monitor Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Monitoramento de Custos de API</CardTitle>
                    <CardDescription>Gasto acumulado no ciclo atual.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <CostRow name="OpenAI (GPT-4o)" cost="$145.20" limit="$500.00" />
                        <CostRow name="ElevenLabs (TTS)" cost="$89.50" limit="$200.00" />
                        <CostRow name="HeyGen (Avatar)" cost="$420.00" limit="$1,000.00" />
                        <CostRow name="YouTube API" cost="$0.00" limit="Quotas" />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

function StatCard({ title, value, change, trend, icon }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center text-xs mt-1">
                    {trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{change}</span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
            </CardContent>
        </Card>
    );
}

function CostRow({ name, cost, limit }: { name: string, cost: string, limit: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex flex-col">
                <span className="text-sm font-semibold uppercase tracking-widest">{name}</span>
                <span className="text-[10px] text-muted-foreground">Limite: {limit}</span>
            </div>
            <div className="text-right">
                <span className="text-sm font-mono font-bold text-primary">{cost}</span>
                <div className="h-1 bg-muted w-24 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-1/3"></div>
                </div>
            </div>
        </div>
    );
}
