'use client';

import React from 'react';
import { Application } from '@/types';
import { Phone, Calendar, Shield } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
  isLoading?: boolean;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  isLoading = false,
}) => {
  const formatPhoneNumber = (phone: string) => {

    if (phone.length === 11 && phone.startsWith('0')) {
      return `+90 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSelectedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Shield className="h-12 w-12" />
        </div>
        <p className="text-gray-500 text-lg">Henüz başvuru bulunmuyor</p>
        <p className="text-gray-400 text-sm mt-2">
          Başvurular buraya görünecek
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
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{application.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-500 mr-2" />
                  <div className="text-sm font-medium text-gray-900">
                    {application.insuranceName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-500 mr-2" />
                  <div className="text-sm text-gray-900">
                    {formatPhoneNumber(application.phone)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                  <div className="text-sm text-gray-900">
                    {formatSelectedDate(application.selectedDate)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(application.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
            <span className="text-sm text-gray-600">Yükleniyor...</span>
          </div>
        </div>
      )}
    </div>
  );
};
