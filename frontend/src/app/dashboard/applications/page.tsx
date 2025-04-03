'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Loading } from '@/components/Loading';
import { ApplicationTable } from '@/components/ApplicationTable';
import { ApplicationFilter } from '@/components/ApplicationFilter';
import { api } from '@/lib/api';
import { Application, Insurance } from '@/types';
import { RefreshCw, FileText, Download } from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadData = async () => {
    try {
      setIsLoading(true);


      const [applicationsResponse, insurancesResponse] = await Promise.all([
        api.getApplications(),
        api.getInsurances(),
      ]);

      if (applicationsResponse.success && applicationsResponse.data) {
        setApplications(applicationsResponse.data);
      } else {
        setError('Başvurular yüklenirken hata oluştu');
      }

      if (insurancesResponse.success && insurancesResponse.data) {
        setInsurances(insurancesResponse.data);
      }
    } catch (error) {
      setError('Veriler yüklenirken hata oluştu');
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadData();
    } finally {
      setIsRefreshing(false);
    }
  };


  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;


    if (selectedInsuranceId) {
      filtered = filtered.filter(app => app.insuranceId === selectedInsuranceId);
    }


    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [applications, selectedInsuranceId, sortOrder]);

  const handleExportToCSV = () => {
    const csvData = filteredAndSortedApplications.map(app => ({
      ID: app.id,
      'Sigorta Türü': app.insuranceName,
      Telefon: app.phone,
      'Seçilen Tarih': new Date(app.selectedDate).toLocaleDateString('tr-TR'),
      'Başvuru Tarihi': new Date(app.createdAt).toLocaleDateString('tr-TR'),
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `basvurular_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Loading size="lg" text="Başvurular yükleniyor..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">

          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Başvuru Yönetimi
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Tüm sigorta başvurularını görüntüleyin ve yönetin
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Yenile
              </button>

              {filteredAndSortedApplications.length > 0 && (
                <button
                  onClick={handleExportToCSV}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV İndir
                </button>
              )}
            </div>
          </div>


          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}


          <ApplicationFilter
            insurances={insurances}
            selectedInsuranceId={selectedInsuranceId}
            onInsuranceChange={setSelectedInsuranceId}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            totalCount={applications.length}
            filteredCount={filteredAndSortedApplications.length}
          />


          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Başvuru Listesi
                </h3>
              </div>

              <ApplicationTable
                applications={filteredAndSortedApplications}
                isLoading={isRefreshing}
              />
            </div>
          </div>


          {applications.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Özet İstatistikler
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Toplam Başvuru</div>
                    <div className="text-2xl font-bold text-blue-900">{applications.length}</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Bugünkü Başvuru</div>
                    <div className="text-2xl font-bold text-green-900">
                      {applications.filter(app =>
                        app.createdAt.startsWith(new Date().toISOString().split('T')[0])
                      ).length}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-600">En Popüler Sigorta</div>
                    <div className="text-sm font-bold text-purple-900">
                      {(() => {
                        const counts = applications.reduce((acc, app) => {
                          acc[app.insuranceName] = (acc[app.insuranceName] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        const mostPopular = Object.entries(counts)
                          .sort(([,a], [,b]) => b - a)[0];

                        return mostPopular ? mostPopular[0] : 'Yok';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
