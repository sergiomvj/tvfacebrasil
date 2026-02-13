"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Edit, MoreHorizontal, Calendar, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const mockScripts = [
    { id: "s1", title: "Mudanças na Lei de Imigração 2026", author: "AI Agent", status: "draft", lastEdited: "10 min ago", version: 1.2 },
    { id: "s2", title: "Festival Brasileiro em Orlando", author: "Maria Silva", status: "review", lastEdited: "1h ago", version: 2.0 },
    { id: "s3", title: "Guia de Abertura de Empresas", author: "AI Agent", status: "approved", lastEdited: "3h ago", version: 1.0 },
    { id: "s4", title: "Dicas de Saúde Inverno", author: "Carlos Souza", status: "draft", lastEdited: "1d ago", version: 1.1 },
];

export default function ScriptsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roteiros</h2>
                    <p className="text-muted-foreground">Gerencie, edite e aprove os roteiros gerados pela IA.</p>
                </div>
                <Button>
                    + Novo Roteiro
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Roteiros Recentes</CardTitle>
                    <CardDescription>Lista de todos os roteiros em fase de produção.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Autor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Versão</TableHead>
                                <TableHead>Última Edição</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockScripts.map((script) => (
                                <TableRow key={script.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            {script.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback>{script.author[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{script.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            script.status === 'approved' ? 'default' :
                                                script.status === 'review' ? 'secondary' : 'outline'
                                        }>
                                            {script.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>v{script.version}</TableCell>
                                    <TableCell className="text-muted-foreground">{script.lastEdited}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/dashboard/scripts/${script.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
