// ============================================
// PÁGINA: SETTINGS - Integrações
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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface IntegrationStatus {
  provider: string;
  connected: boolean;
  lastSync?: string;
  error?: string;
}

export default function SettingsPage() {
  const [youtubeStatus, setYoutubeStatus] = useState<IntegrationStatus | null>(null);
  const [metaStatus, setMetaStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

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
        error: youtubeData.error
      });
      setTestResult(youtubeData);

      // TODO: Check Meta when implemented
      setMetaStatus({
        provider: 'Meta (Instagram/Facebook)',
        connected: false,
        error: 'Not configured'
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
      connectUrl: '#', // TODO: Implement Meta OAuth
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
      connectUrl: '#', // TODO: Implement Meta OAuth
      docsUrl: 'https://developers.facebook.com/docs/graph-api'
    }
  ];

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
        {/* YouTube Test Result */}
        {testResult && (
          <div className={`mb-8 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? 'YouTube Data API v3 configurada!' : 'Erro na configuração'}
              </span>
            </div>
            
            {testResult.success && (
              <div className="text-sm text-green-700 space-y-1">
                <p>✅ Client ID configurado</p>
                <p>✅ Client Secret configurado</p>
                <p>✅ Redirect URI: {testResult.redirect_uri}</p>
                
                <div className="mt-4">
                  <p className="font-medium">Próximos passos:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    {testResult.next_steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="mt-4">
                  <a 
                    href={testResult.auth_url}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Youtube className="w-4 h-4" />
                    Conectar Conta do YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                  <integration.icon className={`w-6 h-6 ${integration.color}`} />
                </div>
                
                {integration.status && (
                  <div className="flex items-center gap-1">
                    {integration.status.connected ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600">Conectado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Não conectado</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{integration.description}</p>

              <div className="space-y-2">
                {integration.status?.error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {integration.status.error}
                  </p>
                )}

                <div className="flex gap-2">
                  {integration.status?.connected ? (
                    <button className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                      Desconectar
                    </button>
                  ) : (
                    <Link
                      href={integration.connectUrl}
                      className={`flex-1 px-4 py-2 rounded-lg text-white text-sm text-center ${
                        integration.id === 'youtube' 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {integration.id === 'youtube' ? 'Conectar' : 'Em breve'}
                    </Link>
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
          <h3 className="font-semibold text-blue-900 mb-2">Precisa de ajuda?</h3>
          <p className="text-blue-700 mb-4">
            Consulte o guia completo de configuração das APIs em:
          </p>
          <a 
            href="/docs/GUIA_APIS_YOUTUBE_META.md"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            📄 docs/GUIA_APIS_YOUTUBE_META.md
          </a>
        </div>
      </div>
    </div>
  );
}
