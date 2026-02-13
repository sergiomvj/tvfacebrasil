
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Plus, Megaphone, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function AdsPage() {
    const { data: ads, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching ads:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Anúncios</h2>
                    <p className="text-muted-foreground">Gerencie os banners e espaços publicitários do portal.</p>
                </div>
                <Link href="/dashboard/ads/new">
                    <Button className="gap-2">
                        <Plus size={16} />
                        Novo Anúncio
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Banners Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                    {!ads || ads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <Megaphone size={48} className="mb-4 opacity-20" />
                            <p>Nenhum anúncio cadastrado.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Banner</th>
                                        <th className="p-4">Campanha</th>
                                        <th className="p-4">Local (Slot)</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Impressões</th>
                                        <th className="p-4 text-right">Cliques</th>
                                        <th className="p-4 w-[50px]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ads.map((ad) => (
                                        <tr key={ad.id} className="border-t hover:bg-muted/5 transition-colors">
                                            <td className="p-4">
                                                <div className="w-24 h-12 bg-muted rounded overflow-hidden relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={ad.image_url}
                                                        alt={ad.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">{ad.title}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {ad.slot}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={ad.active ? "default" : "secondary"}>
                                                    {ad.active ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right tabular-nums">{ad.impressions || 0}</td>
                                            <td className="p-4 text-right tabular-nums">{ad.clicks || 0}</td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/ads/${ad.id}`} className="flex items-center gap-2 cursor-pointer">
                                                                <Pencil size={14} /> Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                                                                <Eye size={14} /> Visualizar Link
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive flex items-center gap-2 cursor-pointer">
                                                            <Trash2 size={14} /> Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
