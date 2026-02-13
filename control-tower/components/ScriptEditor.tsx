// ============================================
// COMPONENTE: SCRIPT EDITOR
// Editor de Roteiro com Aprovação
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Save, 
  CheckCircle, 
  FileText, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '@/control-tower/services/control-tower-service';

interface ScriptEditorProps {
  video: Video | null;
  articleContent: string | null;
  loading: boolean;
  onApprove: (scriptData: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }) => void;
  onRegenerate?: () => void;
}

const ScriptField = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 4 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  </div>
);

export function ScriptEditor({ 
  video, 
  articleContent, 
  loading, 
  onApprove,
  onRegenerate 
}: ScriptEditorProps) {
  const [hook, setHook] = useState('');
  const [intro, setIntro] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Initialize from video data
  useEffect(() => {
    if (video) {
      setHook(video.script_hook || '');
      setIntro(video.script_intro || '');
      setBody(video.script_body || '');
      setCta(video.script_cta || '');
      setIsDirty(false);
    }
  }, [video?.id]);

  // Mark as dirty when any field changes
  useEffect(() => {
    if (video) {
      const hasChanges = 
        hook !== (video.script_hook || '') ||
        intro !== (video.script_intro || '') ||
        body !== (video.script_body || '') ||
        cta !== (video.script_cta || '');
      setIsDirty(hasChanges);
    }
  }, [hook, intro, body, cta, video]);

  const handleApprove = () => {
    const fullScript = `${hook}\n\n${intro}\n\n${body}\n\n${cta}`;
    onApprove({
      hook,
      intro,
      body,
      cta,
      full: fullScript,
    });
  };

  // Generate mock script from article (simulação)
  const handleGenerateFromArticle = () => {
    if (!articleContent) return;
    
    // Simulação de geração de roteiro
    const paragraphs = articleContent.split('\n').filter(p => p.trim().length > 0);
    
    setHook(`🎬 ${video?.article_title || 'Título do vídeo'} - Você não vai acreditar nisso!`);
    setIntro('Olá! Bem-vindo à TV Facebrasil. Hoje vamos falar sobre um assunto muito importante para nossa comunidade.');
    setBody(paragraphs.slice(0, 3).join('\n\n') || 'Conteúdo principal do artigo...');
    setCta('E aí, o que achou? Deixe seu comentário e não se esqueça de se inscrever no canal!');
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Selecione um vídeo para editar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Original Article */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Artigo Original
          </h3>
          <span className="text-sm text-gray-500">
            {video.article_title}
          </span>
        </div>
        
        <div className="bg-gray-50 rounded-lg border p-4 h-[500px] overflow-y-auto">
          {articleContent ? (
            <div className="prose prose-sm max-w-none">
              {articleContent.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">
              Conteúdo do artigo não disponível
            </div>
          )}
        </div>
      </div>

      {/* Right: Script Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Roteiro do Vídeo
          </h3>
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                Regenerar
              </button>
            )}
            <button
              onClick={handleGenerateFromArticle}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Gerar do Artigo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <ScriptField
            label="Hook (Gancho inicial - 5s)"
            value={hook}
            onChange={setHook}
            placeholder="Algo que prenda a atenção imediatamente..."
            rows={2}
          />

          <ScriptField
            label="Introdução (10-15s)"
            value={intro}
            onChange={setIntro}
            placeholder="Apresente o tema e qual problema vai resolver..."
            rows={3}
          />

          <ScriptField
            label="Corpo (Conteúdo principal)"
            value={body}
            onChange={setBody}
            placeholder="Desenvolva os pontos principais do artigo..."
            rows={6}
          />

          <ScriptField
            label="Call to Action (CTA - 5s)"
            value={cta}
            onChange={setCta}
            placeholder="O que o espectador deve fazer agora?"
            rows={2}
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview do Roteiro Completo</h4>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {`${hook}\n\n${intro}\n\n${body}\n\n${cta}`.trim() || 'Preencha os campos acima para ver o preview...'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          {isDirty && (
            <span className="text-sm text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Alterações não salvas
            </span>
          )}
          
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleApprove}
              disabled={!hook || !intro || !body || !cta}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Aprovar Roteiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
