// ============================================
// PÁGINA: GERENCIAMENTO DE ANUNCIANTES
// /dashboard/advertisers
// ============================================

'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { useAdvertisers } from '@/control-tower/hooks/useControlTower';
import { Advertiser } from '@/control-tower/services/control-tower-service';

export default function AdvertisersPage() {
  const { advertisers, loading, refresh } = useAdvertisers();
  const [showModal, setShowModal] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState<Advertiser | null>(null);

  const handleEdit = (advertiser: Advertiser) => {
    setEditingAdvertiser(advertiser);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este anunciante?')) {
      // TODO: Implement delete
      alert('Funcionalidade de exclusão em desenvolvimento');
    }
  };

  const handleCreate = () => {
    setEditingAdvertiser(null);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anunciantes</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Carregando...' : `${advertisers.length} anunciantes cadastrados`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Atualizar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Novo Anunciante
          </button>
        </div>
      </div>

      {/* Advertisers Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo de Anúncio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Métricas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : advertisers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhum anunciante cadastrado
                  </td>
                </tr>
              ) : (
                advertisers.map((advertiser) => (
                  <tr key={advertiser.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {advertiser.logo_url ? (
                          <img
                            src={advertiser.logo_url}
                            alt={advertiser.company_name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {advertiser.company_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{advertiser.company_name}</p>
                          <p className="text-sm text-gray-500">{advertiser.contact_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                        {advertiser.ad_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 text-xs rounded-full
                        ${advertiser.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                        ${advertiser.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${advertiser.status === 'inactive' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {advertiser.status === 'active' && 'Ativo'}
                        {advertiser.status === 'paused' && 'Pausado'}
                        {advertiser.status === 'inactive' && 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <p>{advertiser.total_impressions.toLocaleString()} impressões</p>
                        <p>{advertiser.total_clicks.toLocaleString()} cliques</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {advertiser.website_url && (
                          <a
                            href={advertiser.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            title="Ver site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(advertiser)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(advertiser.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (simplified) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingAdvertiser ? 'Editar Anunciante' : 'Novo Anunciante'}
            </h2>
            <p className="text-gray-500 mb-4">
              Funcionalidade em desenvolvimento. Em breve você poderá {editingAdvertiser ? 'editar' : 'cadastrar'} anunciantes.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
