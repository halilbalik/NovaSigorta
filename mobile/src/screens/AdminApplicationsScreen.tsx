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
  Linking,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminApi } from '../services/api';
import { RootStackParamList, Application } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Props {
  navigation: NavigationProp<RootStackParamList, 'AdminApplications'>;
}

const AdminApplicationsScreen: React.FC<Props> = ({ navigation }) => {
  const { token } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    if (!token) return;

    try {
      const response = await adminApi.getAllApplications(token);
      if (response.success && response.data) {
        const sortedApplications = response.data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setApplications(sortedApplications);
      }
    } catch (error) {
      console.error('Load applications error:', error);
      Alert.alert('Hata', 'Başvurular yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleCallPhone = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Hata', 'Telefon uygulaması açılamadı');
    });
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

  const formatSelectedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getApplicationsByDate = () => {
    const today = new Date();
    const todayApplications = applications.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate.toDateString() === today.toDateString();
    });

    const yesterdayApplications = applications.filter(app => {
      const appDate = new Date(app.createdAt);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return appDate.toDateString() === yesterday.toDateString();
    });

    const olderApplications = applications.filter(app => {
      const appDate = new Date(app.createdAt);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return appDate < yesterday;
    });

    return { todayApplications, yesterdayApplications, olderApplications };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const { todayApplications, yesterdayApplications, olderApplications } = getApplicationsByDate();

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
        <Text style={styles.headerTitle}>Başvuru Listesi</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Toplam {applications.length} başvuru
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {applications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz başvuru bulunmuyor</Text>
          </View>
        ) : (
          <>
            {todayApplications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bugün ({todayApplications.length})</Text>
                {todayApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onCallPhone={handleCallPhone}
                    formatDate={formatDate}
                    formatSelectedDate={formatSelectedDate}
                  />
                ))}
              </View>
            )}

            {yesterdayApplications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dün ({yesterdayApplications.length})</Text>
                {yesterdayApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onCallPhone={handleCallPhone}
                    formatDate={formatDate}
                    formatSelectedDate={formatSelectedDate}
                  />
                ))}
              </View>
            )}

            {olderApplications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Önceki ({olderApplications.length})</Text>
                {olderApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onCallPhone={handleCallPhone}
                    formatDate={formatDate}
                    formatSelectedDate={formatSelectedDate}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ApplicationCardProps {
  application: Application;
  onCallPhone: (phone: string) => void;
  formatDate: (date: string) => string;
  formatSelectedDate: (date: string) => string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onCallPhone,
  formatDate,
  formatSelectedDate,
}) => {
  return (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.insuranceName}>{application.insuranceName}</Text>
        <Text style={styles.applicationDate}>
          {formatDate(application.createdAt)}
        </Text>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Seçilen Tarih:</Text>
          <Text style={styles.detailValue}>
            {formatSelectedDate(application.selectedDate)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Telefon:</Text>
          <TouchableOpacity
            onPress={() => onCallPhone(application.phone)}
            style={styles.phoneContainer}
          >
            <Text style={styles.phoneText}>{application.phone}</Text>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  placeholder: {
    minWidth: 80,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insuranceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  applicationDate: {
    fontSize: 12,
    color: '#64748b',
  },
  applicationDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  phoneText: {
    fontSize: 14,
    color: '#0369a1',
    fontWeight: '500',
    marginRight: 4,
  },
  callIcon: {
    fontSize: 12,
  },
});

export default AdminApplicationsScreen;
