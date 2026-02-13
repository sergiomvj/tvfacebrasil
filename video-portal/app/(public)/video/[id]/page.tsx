import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Play, Clock, Share2, ThumbsUp, MessageSquare, Bookmark, Lock } from "lucide-react";
import Link from "next/link";
import { AdBanner, SidebarAd } from "@/components/ads";

export default function VideoPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Breadcrumb */}
                    <Breadcrumb>
                        <BreadcrumbList className="uppercase text-[10px] font-bold tracking-widest">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/categoria/imigracao">Imigração</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Novas Regras de Asilo 2026</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Player Section */}
                    <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 relative">
                        <AspectRatio ratio={16 / 9}>
                            {/* Premium Gate Logic Placeholder */}
                            <div className="w-full h-full bg-muted flex flex-col items-center justify-center relative group">
                                <Lock className="w-16 h-16 text-amber-500/50 mb-4" />
                                <div className="text-center z-10 px-6">
                                    <h2 className="text-xl font-black uppercase italic mb-2">Conteúdo Premium</h2>
                                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">Assine agora para ter acesso ilimitado a este guia e outros conteúdos exclusivos.</p>
                                    <Button className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-full px-8 shadow-xl">
                                        Assinar Premium - $9.90
                                    </Button>
                                </div>

                                {/* Background blur effect */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                            </div>
                        </AspectRatio>
                    </div>

                    {/* Ad below player */}
                    <AdBanner slot="video-bottom" />

                    {/* Info Section */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-primary hover:bg-primary uppercase font-bold text-[10px]">Imigração</Badge>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Publicado há 2 horas</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight">
                            Novas Regras de Asilo nos EUA em 2026: Guia Completo para Brasileiros
                        </h1>

                        <div className="flex items-center justify-between py-4 border-y border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold">FB</div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-primary">TV Facebrasil</p>
                                    <p className="text-xs text-muted-foreground">Original Content</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" size="sm" className="rounded-full uppercase text-[10px] font-bold tracking-widest">
                                    <ThumbsUp className="w-3 h-3 mr-2" /> 1.2k
                                </Button>
                                <Button variant="secondary" size="sm" className="rounded-full uppercase text-[10px] font-bold tracking-widest">
                                    <Share2 className="w-3 h-3 mr-2" /> Compartilhar
                                </Button>
                            </div>
                        </div>

                        <div className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                            <p>
                                As novas diretrizes anunciadas pelo Departamento de Segurança Interna (DHS) trazem mudanças significativas para os pedidos de asilo na fronteira sul e processamentos internos.
                            </p>
                            <p className="mt-4">
                                Neste vídeo, explicamos detalhadamente os três principais pilares da nova política:
                                <br />1. Critérios de admissibilidade mais rigorosos.
                                <br />2. Novos prazos para triagem inicial.
                                <br />3. Incentivo ao uso do aplicativo CBP One.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Related Videos */}
                <div className="space-y-6">
                    <SidebarAd slot="video-sidebar" />

                    <h3 className="text-lg font-black uppercase italic tracking-tighter border-l-4 border-primary pl-3">
                        Vídeos Relacionados
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <RelatedCard key={i} />
                        ))}
                    </div>

                    <SidebarAd slot="video-sidebar-bottom" />
                </div>
            </div>
        </div>
    );
}

function RelatedCard() {
    return (
        <div className="group flex gap-3 cursor-pointer">
            <div className="w-32 h-20 flex-shrink-0 relative rounded-lg overflow-hidden bg-muted">
                <Play className="absolute inset-0 m-auto w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 space-y-1">
                <h4 className="text-xs font-bold leading-tight line-clamp-2 uppercase group-hover:text-primary transition-colors">
                    Como se preparar para a entrevista de asilo nos EUA
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-sans font-medium">
                    <Clock className="w-3 h-3" /> Há 1 dia
                </div>
            </div>
        </div>
    );
}
