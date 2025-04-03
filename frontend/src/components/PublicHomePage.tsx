'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Phone, Calendar, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Insurance, CreateApplicationRequest } from '@/types';

export const PublicHomePage: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [applicationData, setApplicationData] = useState<CreateApplicationRequest>({
    insuranceId: 0,
    selectedDate: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInsuranceName, setSuccessInsuranceName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = async () => {
    try {
      setIsLoading(true);
      const response = await api.getActiveInsurances();

      if (response.success && response.data) {
        const activeInsurances = response.data.filter(insurance => insurance.isActive);
        setInsurances(activeInsurances);
      }
    } catch (error) {
      console.error('Load insurances error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsuranceSelect = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setApplicationData(prev => ({
      ...prev,
      insuranceId: insurance.id,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInsurance || !applicationData.selectedDate || !applicationData.phone) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');


      const formattedData = {
        ...applicationData,
        selectedDate: new Date(applicationData.selectedDate).toISOString(),
      };

      const response = await api.createPublicApplication(formattedData);

      if (response.success) {
        setSuccessInsuranceName(selectedInsurance?.name || '');
        setIsSuccess(true);
        setApplicationData({ insuranceId: 0, selectedDate: '', phone: '' });
        setSelectedInsurance(null);
      } else {
        setError('Başvuru gönderilirken hata oluştu');
      }
    } catch (error) {
      setError('Başvuru gönderilirken hata oluştu');
      console.error('Submit application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setSuccessInsuranceName('');
    setError('');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Başvurunuz Alındı!
          </h2>
          <p className="text-gray-600 mb-6">
            <strong>{successInsuranceName}</strong> sigortası için başvurunuz başarıyla gönderildi.
            En kısa sürede sizinle iletişime geçeceğiz.
          </p>


          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-blue-800">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Acil durumlar için:
                <a href="tel:+902125550123" className="ml-2 font-semibold hover:underline">
                  +90 (212) 555-0123
                </a>
              </span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Yeni Başvuru Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Nova Sigorta</h1>
            </div>
            <Link
              href="/login"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              Admin Girişi
            </Link>
          </div>
        </div>
      </header>


      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sigorta Başvurunuzu Yapın
          </h2>
          <p className="text-xl text-gray-600">
            Size en uygun sigorta türünü seçin ve hemen başvuru yapın
          </p>
        </div>


        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
              Sigorta Türünü Seçin
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-gray-600">Sigorta türleri yükleniyor...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insurances.map((insurance) => (
                  <button
                    key={insurance.id}
                    onClick={() => handleInsuranceSelect(insurance)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedInsurance?.id === insurance.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{insurance.name}</h4>
                    <p className="text-sm text-gray-600">{insurance.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>


          {selectedInsurance && (
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                Başvuru Bilgileri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    İstediğiniz Tarih
                  </label>
                  <input
                    type="date"
                    id="selectedDate"
                    name="selectedDate"
                    value={applicationData.selectedDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Başvuru Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Başvuru Gönder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
