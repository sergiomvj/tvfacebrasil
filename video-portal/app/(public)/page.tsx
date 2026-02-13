import { Play, Clock, ChevronRight, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AdBanner, SidebarAd } from "@/components/ads";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="bg-background min-h-screen text-foreground pb-20 selection:bg-primary selection:text-white">

            {/* Top Ad */}
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <AdBanner slot="home-top" />
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column (Main News) - Span 8 */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Hero Section */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 shadow-2xl border border-white/5 bg-zinc-900">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-10">
                                <span className="inline-block bg-primary text-white text-[10px] font-heading font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest shadow-lg">
                                    Exclusivo
                                </span>
                                <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-4 tracking-tight drop-shadow-lg">
                                    Imigração 2026: Entenda as novas regras para o visto EB-2
                                </h1>
                                <p className="text-zinc-300 text-lg leading-relaxed line-clamp-2 max-w-3xl hidden md:block">
                                    Mudanças na legislação devem facilitar a entrada de profissionais qualificados. Especialistas analisam o cenário e o impacto para brasileiros.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sub-Hero Grid (2 Cols) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <NewsCard
                            image="https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=500"
                            category="Economia"
                            title="Dólar fecha em queda e turismo reaquece na Flórida"
                            summary="Com a cotação a R$ 4,90, brasileiros voltam a planejar viagens para Disney e Miami."
                            time="Há 2 horas"
                        />
                        <NewsCard
                            image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=500"
                            category="Comunidade"
                            title="Festival Brasileiro em Orlando espera 10 mil pessoas"
                            summary="Evento reunirá grandes nomes da música e gastronomia típica neste fim de semana."
                            time="Há 4 horas"
                            video
                        />
                    </div>

                    {/* List Section */}
                    <div className="border-t border-white/5 pt-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-primary rounded-full" />
                                Últimas Notícias
                            </h2>
                            <Link href="#" className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
                                Ver todas <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-6 divide-y divide-white/5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="py-2 flex gap-5 group cursor-pointer hover:bg-white/5 transition-all -mx-4 px-4 rounded-xl items-center">
                                    <div className="w-24 h-24 bg-card rounded-lg overflow-hidden flex-shrink-0 relative border border-white/5 shadow-sm">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Mundo</span>
                                            <span className="text-[10px] text-zinc-600">•</span>
                                            <span className="text-[10px] text-zinc-500 font-mono">14:30</span>
                                        </div>
                                        <h3 className="font-heading text-lg font-semibold text-zinc-100 leading-tight mb-1 group-hover:text-primary transition-colors">
                                            Brasileiros podem usar CNH para dirigir em Portugal sem troca de documento.
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-1 hidden md:block leading-relaxed">
                                            Novo acordo bilateral facilita a vida de motoristas e turistas nos dois países.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Span 4 */}
                <aside className="lg:col-span-4 space-y-8">

                    {/* Live Box */}
                    <div className="bg-card rounded-xl overflow-hidden border border-white/5 shadow-xl">
                        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-sm">
                            <span className="text-white font-bold text-xs uppercase flex items-center gap-2 tracking-widest">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Ao Vivo
                            </span>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Estúdio A</span>
                        </div>

                        <div className="aspect-video bg-zinc-900 relative flex items-center justify-center group cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-50" />
                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <Play className="w-5 h-5 text-white fill-current ml-1" />
                            </div>
                        </div>

                        <div className="p-5">
                            <h4 className="font-heading font-bold text-white mb-1">Jornal da Manhã - Edição EUA</h4>
                            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                                As principais notícias para começar o dia bem informado.
                            </p>
                        </div>
                    </div>

                    {/* Stats / Market */}
                    <div className="bg-card border border-white/5 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Mercado Financeiro</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-white/5 text-primary"><TrendingUp className="w-4 h-4" /></div>
                                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">Dólar Comercial</span>
                                </div>
                                <span className="font-mono font-bold text-emerald-400">R$ 4,92</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-white/5 text-zinc-500"><TrendingUp className="w-4 h-4" /></div>
                                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">Euro</span>
                                </div>
                                <span className="font-mono font-bold text-zinc-400">R$ 5,35</span>
                            </div>
                        </div>
                    </div>

                    {/* Most Read - Styled as Ranking */}
                    {/* Most Viewed Videos (Renamed) */}
                    <div className="bg-card border border-white/5 rounded-xl p-6">
                        <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Play className="w-5 h-5 text-primary" />
                            Vídeos mais vistos
                        </h3>
                        <ol className="space-y-5">
                            {[
                                "Como renovar o passaporte brasileiro nos EUA",
                                "Disney anuncia novas atrações para o verão",
                                "Voo direto Orlando-Recife começa a operar",
                                "Imposto de Renda 2026: O que muda para expatriados"
                            ].map((title, i) => (
                                <li key={i} className="group cursor-pointer flex gap-4 items-start">
                                    <span className="text-lg font-heading font-black text-white/20 group-hover:text-primary transition-colors leading-none">
                                        0{i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-snug">
                                        {title}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Ad Container - MREC 300x250 */}
                    <div className="py-4 flex justify-center">
                        <SidebarAd slot="sidebar-mid" />
                    </div>

                    {/* Community Highlight Section */}
                    <div className="bg-card border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Comunidade
                            </h3>
                            <Link href="#" className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider transition-colors">
                                Ver tudo
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden relative mb-2 border border-white/5">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-zinc-200 group-hover:text-primary transition-colors leading-tight">
                                        Brasileiros em destaque: Conheça a história de sucesso do chef André em Miami
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </aside>
            </main>

            {/* Video Docs Facebrasil - Full Width Section */}
            <section className="w-full bg-zinc-900/50 border-y border-white/5 py-16 relative overflow-hidden mt-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center fixed-bg" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Séries Originais</span>
                            <h2 className="font-heading text-3xl md:text-4xl font-black text-white">Video Docs Facebrasil</h2>
                        </div>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-primary uppercase text-xs font-bold tracking-widest hidden md:flex">
                            Ver todas as séries
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Florida: O Coração Brasileiro", img: "https://images.unsplash.com/photo-1597535973747-951442d5dbc7?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", ep: "T1:E1" },
                            { title: "Massachusetts: A Força do Trabalho", img: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", ep: "T1:E2" },
                            { title: "New Jersey: Raízes Profundas", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80", ep: "T1:E3" },
                            { title: "California: Sonho e Inovação", img: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80", ep: "T1:E4" }
                        ].map((doc, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[3/4] relative rounded-xl overflow-hidden border border-white/5 shadow-2xl mb-4 group-hover:translate-y-[-8px] transition-transform duration-500 bg-zinc-900">
                                    <img
                                        src={doc.img}
                                        alt={doc.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                                            Doc #{i + 1}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="text-zinc-400 text-[10px] font-mono mb-2 block">{doc.ep}</span>
                                        <h3 className="font-heading font-bold text-xl text-white leading-tight group-hover:text-primary transition-colors">
                                            {doc.title}
                                        </h3>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function NewsCard({ image, category, title, summary, time, video }: any) {
    return (
        <div className="group cursor-pointer flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:translate-y-[-4px] hover:shadow-2xl">
            <div className="aspect-video bg-zinc-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-zinc-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />

                {video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
                            <Play className="w-5 h-5 text-white fill-current ml-1" />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 flex-1 flex flex-col bg-card relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">{category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                        <Clock className="w-3 h-3" /> {time}
                    </div>
                </div>

                <h3 className="font-heading text-xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors flex-1">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {summary}
                </p>
            </div>
        </div>
    )
}
