import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Bem-vindo à Control Tower da TV Facebrasil.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Em Produção"
                    value="12"
                    description="+2 desde ontem"
                    icon={<Video className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Roteiros Pendentes"
                    value="5"
                    description="Aguardando aprovação"
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Vídeos Publicados"
                    value="148"
                    description="+18% no último mês"
                    icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Taxa de Erro"
                    value="2.4%"
                    description="-0.1% na última semana"
                    icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Produção Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded bg-muted/50 flex items-center justify-center">
                                            <Video className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Como obter SSN na Flórida</p>
                                            <p className="text-xs text-muted-foreground">Importado via RSS • Há 2h</p>
                                        </div>
                                    </div>
                                    <Badge variant={i === 1 ? "secondary" : "outline"}>
                                        {i === 1 ? "Renderizando" : "Aguardando"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground space-y-2">
                            <TrendingUp size={32} />
                            <p>Integração com Analytics em breve...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
