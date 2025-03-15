import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminApi } from '../services/api';
import { RootStackParamList, Insurance } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Props {
  navigation: NavigationProp<RootStackParamList, 'AdminInsurances'>;
}

const AdminInsurancesScreen: React.FC<Props> = ({ navigation }) => {
  const { token } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = async () => {
    if (!token) return;

    try {
      const response = await adminApi.getAllInsurances(token);
      if (response.success && response.data) {
        setInsurances(response.data);
      }
    } catch (error) {
      console.error('Load insurances error:', error);
      Alert.alert('Hata', 'Sigortalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsurances();
    setRefreshing(false);
  };

  const handleToggleStatus = async (insurance: Insurance) => {
    if (!token) return;

    const action = insurance.isActive ? 'pasif' : 'aktif';
    Alert.alert(
      'Durum Değiştir',
      `${insurance.name} sigortasını ${action} yapmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const response = await adminApi.toggleInsuranceStatus(token, insurance.id);
              if (response.success) {
                Alert.alert('Başarılı', `Sigorta ${action} yapıldı`);
                loadInsurances();
              } else {
                Alert.alert('Hata', response.message || 'Durum değiştirilemedi');
              }
            } catch (error) {
              Alert.alert('Hata', 'Durum değiştirilirken hata oluştu');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (insurance: Insurance) => {
    if (!token) return;

    Alert.alert(
      'Silme Onayı',
      `${insurance.name} sigortasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminApi.deleteInsurance(token, insurance.id);
              if (response.success) {
                Alert.alert('Başarılı', 'Sigorta silindi');
                loadInsurances();
              } else {
                Alert.alert('Hata', response.message || 'Sigorta silinemedi');
              }
            } catch (error) {
              Alert.alert('Hata', 'Sigorta silinirken hata oluştu');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddInsurance = () => {
    navigation.navigate('AdminInsuranceForm', {});
  };

  const handleEditInsurance = (insurance: Insurance) => {
    navigation.navigate('AdminInsuranceForm', { insurance });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight + 10 : 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sigorta Yönetimi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddInsurance}
        >
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {insurances.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz sigorta bulunmuyor</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={handleAddInsurance}
            >
              <Text style={styles.addFirstButtonText}>İlk Sigortayı Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          insurances.map((insurance) => (
            <View key={insurance.id} style={styles.insuranceCard}>
              <View style={styles.insuranceHeader}>
                <View style={styles.insuranceInfo}>
                  <Text style={styles.insuranceName}>{insurance.name}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: insurance.isActive ? '#10b981' : '#ef4444' }
                    ]}>
                      <Text style={styles.statusText}>
                        {insurance.isActive ? 'Aktif' : 'Pasif'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.insuranceDescription}>
                {insurance.description}
              </Text>

              <Text style={styles.insuranceDate}>
                Oluşturulma: {formatDate(insurance.createdAt)}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditInsurance(insurance)}
                >
                  <Text style={styles.editButtonText}>Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    { backgroundColor: insurance.isActive ? '#f59e0b' : '#10b981' }
                  ]}
                  onPress={() => handleToggleStatus(insurance)}
                >
                  <Text style={styles.toggleButtonText}>
                    {insurance.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(insurance)}
                >
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 10,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  insuranceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insuranceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  insuranceInfo: {
    flex: 1,
  },
  insuranceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  insuranceDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 20,
  },
  insuranceDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default AdminInsurancesScreen;
