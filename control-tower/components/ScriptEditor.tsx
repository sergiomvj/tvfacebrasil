'use client';

import React, { useState } from 'react';
import { 
  Save, 
  Send, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Video } from '../services/control-tower-service';

interface ScriptEditorProps {
  video: Video;
  onSave: (script: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }) => void;
  onApprove: (script: {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    full: string;
  }) => void;
  onRegenerate: () => void;
  onBack: () => void;
  loading: boolean;
}

export function ScriptEditor({
  video,
  onSave,
  onApprove,
  onRegenerate,
  onBack,
  loading
}: ScriptEditorProps) {
  const [script, setScript] = useState({
    hook: video.script_hook || '',
    intro: video.script_intro || '',
    body: video.script_body || '',
    cta: video.script_cta || '',
    full: video.script_full || '',
  });

  const [activeTab, setActiveTab] = useState<'blocks' | 'full'>('blocks');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(script);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleApprove = () => {
    onApprove(script);
  };

  const handleChange = (field: keyof typeof script, value: string) => {
    setScript(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-update full script when blocks change
      if (field !== 'full') {
        updated.full = `${updated.hook}\n\n${updated.intro}\n\n${updated.body}\n\n${updated.cta}`;
      }
      return updated;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Editor de Roteiro</h1>
            <p className="text-sm text-gray-500">{video.article_title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Salvo
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Aprovar Roteiro
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Original Article */}
        <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Artigo Original
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">{video.article_title}</h3>
            {video.article_excerpt && (
              <p className="text-sm text-gray-600 mb-4">{video.article_excerpt}</p>
            )}
            {video.article_content && (
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: video.article_content }}
              />
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 bg-white overflow-y-auto">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('blocks')}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'blocks' 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Blocos
              </button>
              <button
                onClick={() => setActiveTab('full')}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'full' 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Roteiro Completo
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-6">
            {activeTab === 'blocks' ? (
              <div className="space-y-6">
                {/* Hook */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎣 Hook (Gancho Inicial)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Primeiros 5-10 segundos para capturar atenção
                  </p>
                  <textarea
                    value={script.hook}
                    onChange={(e) => handleChange('hook', e.target.value)}
                    placeholder="Você sabia que..."
                    className="w-full h-20 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Intro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎬 Introdução
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Apresentação do tema e contexto
                  </p>
                  <textarea
                    value={script.intro}
                    onChange={(e) => handleChange('intro', e.target.value)}
                    placeholder="Neste vídeo vamos falar sobre..."
                    className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Corpo do Vídeo
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Conteúdo principal - desenvolvimento do tema
                  </p>
                  <textarea
                    value={script.body}
                    onChange={(e) => handleChange('body', e.target.value)}
                    placeholder="Desenvolva aqui o conteúdo principal..."
                    className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* CTA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📢 Call to Action (CTA)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    O que o espectador deve fazer depois
                  </p>
                  <textarea
                    value={script.cta}
                    onChange={(e) => handleChange('cta', e.target.value)}
                    placeholder="Inscreva-se no canal, deixe seu like..."
                    className="w-full h-20 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Regenerate Button */}
                <div className="pt-4 border-t">
                  <button
                    onClick={onRegenerate}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerar com IA
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Visualização completa do roteiro. Edite aqui para ajustes finos.
                </p>
                <textarea
                  value={script.full}
                  onChange={(e) => handleChange('full', e.target.value)}
                  className="w-full h-[500px] p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
