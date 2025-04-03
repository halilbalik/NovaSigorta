'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Loading } from '@/components/Loading';
import { api } from '@/lib/api';
import { Application } from '@/types';
import { Shield, FileText, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInsurances: 0,
    activeInsurances: 0,
    totalApplications: 0,
    todayApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);


      const [insurancesResponse, applicationsResponse] = await Promise.all([
        api.getInsurances(),
        api.getApplications(),
      ]);

      if (insurancesResponse.success && insurancesResponse.data) {
        const insurances = insurancesResponse.data;
        setStats(prev => ({
          ...prev,
          totalInsurances: insurances.length,
          activeInsurances: insurances.filter(i => i.isActive).length,
        }));
      }

      if (applicationsResponse.success && applicationsResponse.data) {
        const applications = applicationsResponse.data;
        const today = new Date().toISOString().split('T')[0];
        const todayApps = applications.filter(app =>
          app.createdAt.startsWith(today)
        );

        setStats(prev => ({
          ...prev,
          totalApplications: applications.length,
          todayApplications: todayApps.length,
        }));


        setRecentApplications(applications.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard data loading error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Toplam Sigorta',
      value: stats.totalInsurances,
      icon: Shield,
      color: 'bg-blue-500',
    },
    {
      title: 'Aktif Sigorta',
      value: stats.activeInsurances,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Toplam Başvuru',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Bugünkü Başvuru',
      value: stats.todayApplications,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Loading size="lg" text="Dashboard yükleniyor..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Nova Sigorta yönetim paneline hoş geldiniz
            </p>
          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${card.color} p-3 rounded-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {card.title}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {card.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Son Başvurular
              </h3>

              {recentApplications.length > 0 ? (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sigorta Türü
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seçilen Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başvuru Tarihi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentApplications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {application.insuranceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.selectedDate).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Henüz başvuru bulunmuyor
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
