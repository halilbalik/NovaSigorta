'use client';

import React from 'react';
import { Insurance } from '@/types';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface InsuranceTableProps {
  insurances: Insurance[];
  onEdit: (insurance: Insurance) => void;
  onDelete: (insurance: Insurance) => void;
  onToggleStatus: (insurance: Insurance) => void;
  isLoading?: boolean;
}

export const InsuranceTable: React.FC<InsuranceTableProps> = ({
  insurances,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}) => {
  if (insurances.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Henüz sigorta eklenmemiş</p>
        <p className="text-gray-400 text-sm mt-2">
          İlk sigortanızı eklemek için &quot;Yeni Sigorta Ekle&quot; butonunu kullanın
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sigorta Adı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Açıklama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Oluşturulma Tarihi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {insurances.map((insurance) => (
            <tr key={insurance.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{insurance.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {insurance.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {insurance.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    insurance.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {insurance.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(insurance.createdAt).toLocaleDateString('tr-TR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(insurance)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onToggleStatus(insurance)}
                    disabled={isLoading}
                    className={`${
                      insurance.isActive
                        ? 'text-orange-600 hover:text-orange-900'
                        : 'text-green-600 hover:text-green-900'
                    } disabled:opacity-50`}
                    title={insurance.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {insurance.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDelete(insurance)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-900 disabled:text-red-300"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
