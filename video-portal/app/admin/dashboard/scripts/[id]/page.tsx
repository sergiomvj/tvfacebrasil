"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Save, CheckCircle, Smartphone, Monitor, Volume2, Download, Rocket, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock Data for a single script
const mockScriptData = {
    id: "s1",
    title: "Mudanças na Lei de Imigração 2026",
    blocks: [
        { type: "hook", duration: "15s", content: "Você sabia que 70% dos vistos negados em 2025 foram por um erro simples? [CÂMERA: Close no apresentador, tom sério]" },
        { type: "intro", duration: "30s", content: "Olá, bem-vindos a TV Facebrasil. Hoje vamos desvendar as novas regras de imigração. [B-ROLL: Imagens de passaportes e aeroporto]" },
        { type: "point1", duration: "45s", content: "Primeiro ponto: A comprovação de renda aumentou. Agora é necessário demonstrar... [GRAFISMO: Tabela comparativa 2025 vs 2026]" },
        { type: "cta", duration: "10s", content: "Se inscreva para mais dicas como essa. [TEXTO: Link na descrição]" },
    ]
};

export default function ScriptEditorPage() {
    const params = useParams();
    const [script, setScript] = useState(mockScriptData);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Roteiro #{params.id}</Badge>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Draft</Badge>
                    </div>
                    <h1 className="text-2xl font-bold">{script.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
                    </Button>
                    <Button>
                        <CheckCircle className="w-4 h-4 mr-2" /> Aprovar para Produção
                    </Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

                {/* Editor Column */}
                <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden h-full">
                    <Tabs defaultValue="writer" className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <TabsList>
                                <TabsTrigger value="writer">Editor de Texto</TabsTrigger>
                                <TabsTrigger value="blocks">Visualização em Blocos</TabsTrigger>
                                <TabsTrigger value="assets">Assets de Produção</TabsTrigger>
                            </TabsList>
                            <span className="text-sm text-muted-foreground">Total Estimado: 1m 40s</span>
                        </div>

                        <TabsContent value="writer" className="flex-1 overflow-hidden data-[state=active]:flex flex-col">
                            <Card className="flex-1 flex flex-col">
                                <CardContent className="flex-1 p-0">
                                    <Textarea
                                        className="min-h-full resize-none border-0 focus-visible:ring-0 p-6 text-lg leading-relaxed font-mono"
                                        defaultValue={script.blocks.map(b => `[${b.type.toUpperCase()} - ${b.duration}]\n${b.content}\n`).join("\n")}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="blocks" className="flex-1 overflow-auto">
                            <div className="space-y-4 pr-4">
                                {script.blocks.map((block, idx) => (
                                    <Card key={idx}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <Badge variant="secondary" className="uppercase">{block.type}</Badge>
                                                <span className="text-xs text-muted-foreground text-mono">{block.duration}</span>
                                            </div>
                                            <p className="text-base">{block.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="assets" className="flex-1 overflow-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assets de Produção</CardTitle>
                                    <CardDescription>Gerencie áudio, vídeo e imagens gerados para este roteiro.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    {/* Audio Asset */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Volume2 className="w-4 h-4" /> Faixa de Áudio (TTS)
                                            </h4>
                                            <Badge variant="outline" className="text-green-500 border-green-500">Gerado</Badge>
                                        </div>
                                        <div className="bg-muted p-3 rounded-md flex items-center gap-3">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary">
                                                <PlayCircle className="w-5 h-5" />
                                            </Button>
                                            <div className="h-1 bg-primary/20 flex-1 rounded-full overflow-hidden">
                                                <div className="h-full w-1/3 bg-primary"></div>
                                            </div>
                                            <span className="text-xs font-mono">00:45 / 02:10</span>
                                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Video Avatar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium flex items-center gap-2">
                                                <Video className="w-4 h-4" /> Avatar (HeyGen)
                                            </h4>
                                            <Badge variant="outline">Pendente</Badge>
                                        </div>
                                        <div className="aspect-video bg-black/50 rounded-lg flex flex-col items-center justify-center border border-dashed border-muted-foreground/30">
                                            <p className="text-sm text-muted-foreground mb-2">Nenhum vídeo gerado ainda</p>
                                            <Button size="sm">
                                                <PlayCircle className="w-4 h-4 mr-2" /> Gerar Avatar
                                            </Button>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Preview & Assets Column */}
                <div className="flex flex-col gap-4">
                    <Card className="flex-1">
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <PlayCircle className="w-5 h-5" /> Preview
                            </h3>

                            <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden group">
                                {/* Mock Video Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-80"></div>
                                <div className="relative z-10 text-white text-center">
                                    <p className="mb-2 text-sm opacity-70">Status: Draft</p>
                                    <Button variant="secondary" size="sm" className="rounded-full">
                                        <Rocket className="mr-2 h-4 w-4" /> Iniciar Produção
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <Button variant="outline" className="w-full text-xs">
                                    <Monitor className="mr-2 w-3 h-3" /> 16:9 (TV)
                                </Button>
                                <Button variant="outline" className="w-full text-xs">
                                    <Smartphone className="mr-2 w-3 h-3" /> 9:16 (Shorts)
                                </Button>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Assets Sugeridos (AI)</h4>
                                <div className="space-y-2">
                                    <div className="text-xs bg-muted p-2 rounded">
                                        <strong>B-Roll 1:</strong> Aeroporto internacional, pessoas andando com malas.
                                    </div>
                                    <div className="text-xs bg-muted p-2 rounded">
                                        <strong>Grafismo 1:</strong> Gráfico de barras animado mostrando crescimento de vistos negados.
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
