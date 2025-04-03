'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Loading } from '@/components/Loading';
import { InsuranceTable } from '@/components/InsuranceTable';
import { InsuranceModal } from '@/components/InsuranceModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { api } from '@/lib/api';
import { Insurance, CreateInsuranceRequest, UpdateInsuranceRequest } from '@/types';
import { Plus, RefreshCw } from 'lucide-react';

export default function InsurancesPage() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);


  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [insuranceToDelete, setInsuranceToDelete] = useState<Insurance | null>(null);

  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadInsurances();
  }, []);


  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const loadInsurances = async () => {
    try {
      setIsLoading(true);
      const response = await api.getInsurances();

      if (response.success && response.data) {
        setInsurances(response.data);
      } else {
        setError('Sigortalar yüklenirken hata oluştu');
      }
    } catch (error) {
      setError('Sigortalar yüklenirken hata oluştu');
      console.error('Load insurances error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateInsuranceRequest) => {
    try {
      setIsActionLoading(true);
      const response = await api.createInsurance(data);

      if (response.success && response.data) {
        setInsurances(prev => [...prev, response.data!]);
        setSuccessMessage('Sigorta başarıyla eklendi');
        setIsModalOpen(false);
      } else {
        setError('Sigorta eklenirken hata oluştu');
      }
    } catch (error) {
      setError('Sigorta eklenirken hata oluştu');
      console.error('Create insurance error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateInsuranceRequest) => {
    if (!selectedInsurance) return;

    try {
      setIsActionLoading(true);
      const response = await api.updateInsurance(selectedInsurance.id, data);

      if (response.success && response.data) {
        setInsurances(prev =>
          prev.map(insurance =>
            insurance.id === selectedInsurance.id ? response.data! : insurance
          )
        );
        setSuccessMessage('Sigorta başarıyla güncellendi');
        setIsModalOpen(false);
        setSelectedInsurance(null);
      } else {
        setError('Sigorta güncellenirken hata oluştu');
      }
    } catch (error) {
      setError('Sigorta güncellenirken hata oluştu');
      console.error('Update insurance error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!insuranceToDelete) return;

    try {
      setIsActionLoading(true);
      const response = await api.deleteInsurance(insuranceToDelete.id);

      if (response.success) {
        setInsurances(prev =>
          prev.filter(insurance => insurance.id !== insuranceToDelete.id)
        );
        setSuccessMessage('Sigorta başarıyla silindi');
        setIsConfirmOpen(false);
        setInsuranceToDelete(null);
      } else {
        setError('Sigorta silinirken hata oluştu');
      }
    } catch (error) {
      setError('Sigorta silinirken hata oluştu');
      console.error('Delete insurance error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStatus = async (insurance: Insurance) => {
    try {
      setIsActionLoading(true);
      const response = await api.toggleInsuranceStatus(insurance.id);

      if (response.success) {
        setInsurances(prev =>
          prev.map(item =>
            item.id === insurance.id
              ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() }
              : item
          )
        );
        setSuccessMessage(
          `Sigorta ${!insurance.isActive ? 'aktif' : 'pasif'} yapıldı`
        );
      } else {
        setError('Sigorta durumu değiştirilirken hata oluştu');
      }
    } catch (error) {
      setError('Sigorta durumu değiştirilirken hata oluştu');
      console.error('Toggle insurance status error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedInsurance(null);
    setIsModalOpen(true);
  };

  const openEditModal = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (insurance: Insurance) => {
    setInsuranceToDelete(insurance);
    setIsConfirmOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInsurance(null);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setInsuranceToDelete(null);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Loading size="lg" text="Sigortalar yükleniyor..." />
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
                Sigorta Yönetimi
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sigorta türlerini yönetin, ekleyin ve düzenleyin
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <button
                onClick={loadInsurances}
                disabled={isLoading || isActionLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Sigorta Ekle
              </button>
            </div>
          </div>


          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}


          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <InsuranceTable
                insurances={insurances}
                onEdit={openEditModal}
                onDelete={openDeleteConfirm}
                onToggleStatus={handleToggleStatus}
                isLoading={isActionLoading}
              />
            </div>
          </div>
        </div>


        <InsuranceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={selectedInsurance ? handleUpdate : handleCreate}
          insurance={selectedInsurance}
          isLoading={isActionLoading}
        />


        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={closeConfirm}
          onConfirm={handleDelete}
          title="Sigortayı Sil"
          message={`"${insuranceToDelete?.name}" sigortasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Sil"
          cancelText="İptal"
          isLoading={isActionLoading}
          type="danger"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
