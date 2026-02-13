// ============================================
// PÁGINA: SETTINGS - Integrações (ATUALIZADA)
// /dashboard/settings
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface IntegrationStatus {
  provider: string;
  connected: boolean;
  partial?: boolean;
  lastSync?: string;
  error?: string;
  details?: any;
}

export default function SettingsPage() {
  const [youtubeStatus, setYoutubeStatus] = useState<IntegrationStatus | null>(null);
  const [metaStatus, setMetaStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIntegrations();
  }, []);

  const checkIntegrations = async () => {
    setLoading(true);
    try {
      // Check YouTube
      const youtubeRes = await fetch('/api/test/youtube-connection');
      const youtubeData = await youtubeRes.json();
      
      setYoutubeStatus({
        provider: 'YouTube',
        connected: youtubeData.success,
        details: youtubeData,
        error: youtubeData.error
      });

      // Check Meta
      const metaRes = await fetch('/api/test/meta-connection');
      const metaData = await metaRes.json();
      
      setMetaStatus({
        provider: 'Meta (Instagram/Facebook)',
        connected: metaData.success,
        partial: metaData.status === 'partial',
        details: metaData,
        error: metaData.error
      });

    } catch (error) {
      console.error('Error checking integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const integrations = [
    {
      id: 'youtube',
      name: 'YouTube Data API v3',
      description: 'Upload automático de vídeos para o canal do YouTube',
      icon: Youtube,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      status: youtubeStatus,
      connectUrl: '/api/auth/youtube',
      docsUrl: 'https://developers.google.com/youtube/v3'
    },
    {
      id: 'instagram',
      name: 'Instagram Graph API',
      description: 'Publicação automática de Reels e Stories',
      icon: Instagram,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      status: metaStatus,
      guideUrl: '/docs/META_ACCESS_TOKEN_GUIDE.md',
      docsUrl: 'https://developers.facebook.com/docs/instagram-api'
    },
    {
      id: 'facebook',
      name: 'Facebook Graph API',
      description: 'Publicação automática na página do Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: metaStatus,
      guideUrl: '/docs/META_ACCESS_TOKEN_GUIDE.md',
      docsUrl: 'https://developers.facebook.com/docs/graph-api'
    }
  ];

  const renderStatus = (integration: typeof integrations[0]) => {
    const status = integration.status;
    
    if (!status) return (
      <div className="flex items-center gap-1">
        <Clock className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Verificando...</span>
      </div>
    );

    if (status.connected) return (
      <div className="flex items-center gap-1">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="text-sm text-green-600">Conectado</span>
      </div>
    );

    if (status.partial) return (
      <div className="flex items-center gap-1">
        <AlertCircle className="w-5 h-5 text-yellow-500" />
        <span className="text-sm text-yellow-600">Parcial</span>
      </div>
    );

    return (
      <div className="flex items-center gap-1">
        <XCircle className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Não conectado</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-500">Gerencie integrações com APIs externas</p>
            </div>
            <button
              onClick={checkIntegrations}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* YouTube Status */}
          {youtubeStatus && (
            <div className={`p-4 rounded-lg border ${youtubeStatus.connected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Youtube className={`w-5 h-5 ${youtubeStatus.connected ? 'text-green-600' : 'text-yellow-600'}`} />
                <span className={`font-medium ${youtubeStatus.connected ? 'text-green-800' : 'text-yellow-800'}`}>
                  YouTube {youtubeStatus.connected ? '✅ Configurado' : '⚠️ Pendente'}
                </span>
              </div>
              {youtubeStatus.connected && youtubeStatus.details?.auth_url && (
                <a 
                  href={youtubeStatus.details.auth_url}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Conectar conta do YouTube →
                </a>
              )}
            </div>
          )}

          {/* Meta Status */}
          {metaStatus && (
            <div className={`p-4 rounded-lg border ${
              metaStatus.connected ? 'bg-green-50 border-green-200' : 
              metaStatus.partial ? 'bg-blue-50 border-blue-200' : 
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Instagram className={`w-5 h-5 ${
                  metaStatus.connected ? 'text-green-600' : 
                  metaStatus.partial ? 'text-blue-600' : 
                  'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  metaStatus.connected ? 'text-green-800' : 
                  metaStatus.partial ? 'text-blue-800' : 
                  'text-yellow-800'
                }`}>
                  Meta (Instagram) {' '}
                  {metaStatus.connected ? '✅ Conectado' : 
                   metaStatus.partial ? '🔧 App OK (falta token)' : 
                   '⚠️ Pendente'}
                </span>
              </div>
              {metaStatus.partial && (
                <div className="text-sm text-blue-700">
                  <p className="mb-1">✅ App ID: {metaStatus.details?.app_id}</p>
                  <a 
                    href="/docs/META_ACCESS_TOKEN_GUIDE.md"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Gerar Access Token →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                  <integration.icon className={`w-6 h-6 ${integration.color}`} />
                </div>
                
                {renderStatus(integration)}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{integration.description}</p>

              <div className="space-y-2">
                {integration.status?.details?.next_steps && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p className="font-medium mb-1">Próximos passos:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {integration.status.details.next_steps.slice(0, 3).map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  {integration.status?.connected ? (
                    <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                      Desconectar
                    </button>
                  ) : integration.id === 'youtube' ? (
                    <Link
                      href={integration.connectUrl}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm text-center"
                    >
                      Conectar
                    </Link>
                  ) : (
                    <a
                      href={integration.guideUrl}
                      className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm text-center"
                    >
                      Como Configurar
                    </a>
                  )}
                  
                  <a
                    href={integration.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📚 Guias de Configuração</h3>
          <div className="space-y-2">
            <a 
              href="/docs/GUIA_APIS_YOUTUBE_META.md"
              className="block text-blue-600 hover:underline"
            >
              → Guia completo YouTube + Meta APIs
            </a>
            <a 
              href="/docs/META_ACCESS_TOKEN_GUIDE.md"
              className="block text-blue-600 hover:underline"
            >
              → Como gerar Access Token do Instagram
            </a>
            <a 
              href="/docs/APIs_NECESSARIAS.md"
              className="block text-blue-600 hover:underline"
            >
              → Lista completa de APIs necessárias
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
