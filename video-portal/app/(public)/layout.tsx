import Link from "next/link";
import { Search, Menu, Play, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">

            {/* Header - Glassmorphism & Brand Colors (Standardized) */}
            <header className="bg-background/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white lg:hidden">
                            <Menu className="w-6 h-6" />
                        </Button>
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* Logo - Icon + Text */}
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary shadow-lg shadow-primary/10 transition-transform group-hover:scale-110">
                                <Tv className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-primary transition-colors uppercase">TV Facebrasil</span>
                        </Link>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-zinc-400">
                        <Link href="#" className="hover:text-white transition-colors">Estados Unidos</Link>
                        <Link href="#" className="hover:text-white transition-colors">Brasil</Link>
                        <Link href="#" className="hover:text-white transition-colors">Comunidade</Link>
                        <Link href="#" className="hover:text-white transition-colors">Economia</Link>
                        <Link href="#" className="hover:text-white transition-colors">Mundo</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-white hover:border-primary/50 transition-all cursor-pointer">
                            <Search className="w-4 h-4" />
                            <span>Buscar</span>
                        </div>
                        <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[10px] tracking-wider gap-2 border border-white/10 rounded-full px-4">
                            <div className="live-pulse">
                                <span></span>
                                <span></span>
                            </div>
                            Ao Vivo
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer - Standardized Dark Mode */}
            <footer className="bg-card border-t border-white/5 mt-auto py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                <Tv className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-heading font-black text-lg tracking-tight text-white uppercase">TV Facebrasil</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            A maior rede de conteúdo brasileiro nos Estados Unidos. Conectando o Brasil ao mundo com jornalismo sério.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4 uppercase text-xs tracking-widest">Navegação</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/videos" className="hover:text-primary transition-colors">Vídeos</Link></li>
                            <li><Link href="/programacao" className="hover:text-primary transition-colors">Programação</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4 uppercase text-xs tracking-widest">Categorias</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/categoria/imigracao" className="hover:text-primary transition-colors">Imigração</Link></li>
                            <li><Link href="/categoria/noticias" className="hover:text-primary transition-colors">Notícias</Link></li>
                            <li><Link href="/categoria/lifestyle" className="hover:text-primary transition-colors">Lifestyle</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4 uppercase text-xs tracking-widest">Newsletter</h4>
                        <div className="flex gap-2">
                            <Input placeholder="Seu e-mail" className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary/50" />
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold">OK</Button>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
                    © {new Date().getFullYear()} TV Facebrasil. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}
