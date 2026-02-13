import Link from "next/link";
import { LayoutDashboard, FileText, Video, BarChart2, Users, Settings, LogOut, Megaphone } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <div className="p-6 h-16 flex items-center border-b">
                    <h1 className="text-xl font-bold tracking-tight text-primary">TV Facebrasil</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Visão Geral" />
                    <NavItem href="/dashboard/queue" icon={<FileText size={20} />} label="Fila de Produção" />
                    <NavItem href="/dashboard/scripts" icon={<FileText size={20} />} label="Roteiros" />
                    <NavItem href="/dashboard/videos" icon={<Video size={20} />} label="Galeria de Vídeos" />
                    <NavItem href="/dashboard/ads" icon={<Megaphone size={20} />} label="Anúncios" />
                    <NavItem href="/dashboard/analytics" icon={<BarChart2 size={20} />} label="Analytics" />

                    <Separator className="my-4" />

                    <NavItem href="/dashboard/team" icon={<Users size={20} />} label="Equipe" />
                    <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Configurações" />
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <UserButton showName />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Logado como</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (visible only on small screens) */}
                <header className="h-16 border-b flex items-center justify-between px-6 md:hidden bg-card">
                    <h1 className="text-lg font-bold">TV Facebrasil</h1>
                    <UserButton afterSignOutUrl="/" />
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
