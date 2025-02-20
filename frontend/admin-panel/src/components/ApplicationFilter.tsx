'use client';

import React from 'react';
import { Insurance } from '@/types';
import { Filter, X } from 'lucide-react';

interface ApplicationFilterProps {
  insurances: Insurance[];
  selectedInsuranceId: number | null;
  onInsuranceChange: (insuranceId: number | null) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalCount: number;
  filteredCount: number;
}

export const ApplicationFilter: React.FC<ApplicationFilterProps> = ({
  insurances,
  selectedInsuranceId,
  onInsuranceChange,
  sortOrder,
  onSortOrderChange,
  totalCount,
  filteredCount,
}) => {
  const clearFilters = () => {
    onInsuranceChange(null);
    onSortOrderChange('desc');
  };

  const hasActiveFilters = selectedInsuranceId !== null || sortOrder !== 'desc';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span>Temizle</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insurance Type Filter */}
        <div>
          <label htmlFor="insurance-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Sigorta Türü
          </label>
          <select
            id="insurance-filter"
            value={selectedInsuranceId || ''}
            onChange={(e) => onInsuranceChange(e.target.value ? parseInt(e.target.value) : null)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
          >
            <option value="">Tüm Sigortalar</option>
            {insurances.map((insurance) => (
              <option key={insurance.id} value={insurance.id}>
                {insurance.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
          >
            <option value="desc">En Yeni</option>
            <option value="asc">En Eski</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <div className="bg-gray-50 px-3 py-2 rounded-md w-full">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredCount}</span>
              {totalCount !== filteredCount && (
                <span> / {totalCount}</span>
              )} başvuru gösteriliyor
            </p>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedInsuranceId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {insurances.find(i => i.id === selectedInsuranceId)?.name}
              <button
                onClick={() => onInsuranceChange(null)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {sortOrder === 'asc' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              En Eski İlk
              <button
                onClick={() => onSortOrderChange('desc')}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
