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
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminApi } from '../services/api';
import { RootStackParamList, Insurance, Application } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Props {
  navigation: NavigationProp<RootStackParamList, 'AdminDashboard'>;
}

interface DashboardStats {
  totalInsurances: number;
  activeInsurances: number;
  totalApplications: number;
  recentApplications: Application[];
}

const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { admin, logout, token } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalInsurances: 0,
    activeInsurances: 0,
    totalApplications: 0,
    recentApplications: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [insurancesResponse, applicationsResponse] = await Promise.all([
        adminApi.getAllInsurances(token),
        adminApi.getAllApplications(token),
      ]);

      if (insurancesResponse.success && insurancesResponse.data) {
        const insurances = insurancesResponse.data;
        const activeInsurances = insurances.filter(ins => ins.isActive);

        const applications = applicationsResponse.success && applicationsResponse.data ?
          applicationsResponse.data : [];

        const recentApplications = applications
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalInsurances: insurances.length,
          activeInsurances: activeInsurances.length,
          totalApplications: applications.length,
          recentApplications,
        });
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
      Alert.alert('Hata', 'Dashboard verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight + 10 : 10 }]}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>
          Hoş geldiniz, {admin?.username}!
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalInsurances}</Text>
            <Text style={styles.statLabel}>Toplam Sigorta</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeInsurances}</Text>
            <Text style={styles.statLabel}>Aktif Sigorta</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.fullWidth]}>
            <Text style={styles.statNumber}>{stats.totalApplications}</Text>
            <Text style={styles.statLabel}>Toplam Başvuru</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminInsurances')}
          >
            <Text style={styles.menuItemText}>📋 Sigorta Yönetimi</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminApplications')}
          >
            <Text style={styles.menuItemText}>📄 Başvuru Listesi</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {stats.recentApplications.length > 0 && (
          <View style={styles.recentApplicationsContainer}>
            <Text style={styles.sectionTitle}>Son Başvurular</Text>
            {stats.recentApplications.map((app) => (
              <View key={app.id} style={styles.applicationItem}>
                <View style={styles.applicationInfo}>
                  <Text style={styles.applicationInsurance}>{app.insuranceName}</Text>
                  <Text style={styles.applicationPhone}>{app.phone}</Text>
                </View>
                <Text style={styles.applicationDate}>
                  {formatDate(app.createdAt)}
                </Text>
              </View>
            ))}
          </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    marginHorizontal: 0,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#64748b',
  },
  recentApplicationsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  applicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  applicationInfo: {
    flex: 1,
  },
  applicationInsurance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  applicationPhone: {
    fontSize: 13,
    color: '#64748b',
  },
  applicationDate: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default AdminDashboardScreen;
