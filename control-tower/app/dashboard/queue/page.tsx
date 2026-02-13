"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, FileText, Video, AlertCircle, CheckCircle2 } from "lucide-react";

// Mock Data
const mockQueue = [
    { id: 1, title: "Mudanças na Lei de Imigração 2026", status: "intake", priority: "high", source: "RSS", score: 9.2, date: "10 min ago" },
    { id: 2, title: "Festival Brasileiro em Orlando bate recorde", status: "scripting", priority: "medium", source: "Manual", score: 7.5, date: "1h ago" },
    { id: 3, title: "Como abrir sua empresa nos EUA: Guia Passo a Passo", status: "rendering", priority: "high", source: "Wordpress", score: 8.8, date: "2h ago" },
    { id: 4, title: "Dicas de saúde para o inverno na Flórida", status: "review", priority: "low", source: "RSS", score: 6.0, date: "4h ago" },
    { id: 5, title: "Novo restaurante brasileiro em Miami", status: "intake", priority: "medium", source: "RSS", score: 7.0, date: "5h ago" },
    { id: 6, title: "Entrevista exclusiva com Consul Geral", status: "published", priority: "high", source: "Manual", score: 9.5, date: "1d ago" },
];

export default function QueuePage() {
    const [activeTab, setActiveTab] = useState("all");

    const filteredQueue = activeTab === "all"
        ? mockQueue
        : mockQueue.filter(item => item.status === activeTab);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Fila de Produção</h2>
                    <p className="text-muted-foreground">Gerencie o fluxo de transformação de notícias em vídeos.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
                    </Button>
                    <Button size="sm">
                        + Adicionar Manualmente
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="intake">Intake</TabsTrigger>
                    <TabsTrigger value="scripting">Roteiro</TabsTrigger>
                    <TabsTrigger value="rendering">Render</TabsTrigger>
                    <TabsTrigger value="review">Revisão</TabsTrigger>
                    <TabsTrigger value="published">Pronto</TabsTrigger>
                </TabsList>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQueue.map((item) => (
                        <QueueItem key={item.id} item={item} />
                    ))}
                </div>
            </Tabs>
        </div>
    );
}

function QueueItem({ item }: { item: any }) {
    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        intake: "secondary",
        scripting: "default",
        rendering: "outline",
        review: "destructive", // highlighting review needed
        published: "secondary",
    };

    const statusLabels: Record<string, string> = {
        intake: "Intake / Análise",
        scripting: "Gerando Roteiro",
        rendering: "Renderizando Vídeo",
        review: "Aguardando Revisão",
        published: "Publicado / Pronto",
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <Badge variant={statusColors[item.status] || "outline"} className="mb-2">
                        {statusLabels[item.status] || item.status}
                    </Badge>
                    {item.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs px-2 py-0">Alta Prioridade</Badge>
                    )}
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {item.date} • Fonte: {item.source}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Score Viral:</span>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex-1">
                        <div
                            className={`h-full ${item.score > 8 ? 'bg-green-500' : item.score > 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(item.score / 10) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold">{item.score}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-0 border-t p-4 bg-muted/20 flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-xs">Ver Detalhes</Button>
                {item.status === 'review' ? (
                    <Button size="sm" className="text-xs gap-1">
                        <FileText className="w-3 h-3" /> Revisar Roteiro
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" className="text-xs gap-1" disabled>
                        <RefreshCw className="w-3 h-3 animate-spin" /> Processando
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
