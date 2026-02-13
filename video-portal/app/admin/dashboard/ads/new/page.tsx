
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewAdPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        image_url: "",
        link_url: "",
        slot: "home-top",
        active: true,
    });

    const slots = [
        { value: "home-top", label: "Topo (Home) - 728x90 / Full" },
        { value: "sidebar-mid", label: "Lateral (Sidebar) - 300x250" },
        { value: "home-footer", label: "Rodapé (Home) - 728x90" },
        { value: "video-detail", label: "Página de Vídeo" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("ads").insert([formData]);

            if (error) throw error;

            router.push("/dashboard/ads");
            router.refresh();
        } catch (error) {
            console.error("Error creating ad:", error);
            alert("Erro ao criar anúncio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/ads">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Novo Anúncio</h2>
                    <p className="text-muted-foreground">Cadastre um novo banner publicitário.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes da Campanha</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título da Campanha</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Promoção de Verão - Cliente X"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="slot">Local de Exibição</Label>
                                <Select
                                    value={formData.slot}
                                    onValueChange={(value) => setFormData({ ...formData, slot: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o local" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {slots.map((slot) => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 flex flex-col justify-end pb-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="active" className="cursor-pointer">Status Ativo</Label>
                                    <Switch
                                        id="active"
                                        checked={formData.active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">URL da Imagem</Label>
                            <Input
                                id="image_url"
                                placeholder="https://..."
                                required
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                            {formData.image_url && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <p className="mb-1">Preview:</p>
                                    <div className="border rounded bg-muted/20 p-2 overflow-hidden flex justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.image_url} alt="Preview" className="max-h-[100px] object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link_url">Link de Destino</Label>
                            <Input
                                id="link_url"
                                placeholder="https://..."
                                required
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Anúncio
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
