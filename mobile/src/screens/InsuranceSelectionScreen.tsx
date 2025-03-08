import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { RootStackParamList, Insurance } from '../types';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

type InsuranceSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InsuranceSelection'
>;

interface Props {
  navigation: InsuranceSelectionScreenNavigationProp;
}

export const InsuranceSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getActiveInsurances();

      if (response.success && response.data) {
        const activeInsurances = response.data.filter(insurance => insurance.isActive);
        setInsurances(activeInsurances);
      } else {
        Alert.alert('Hata', 'Sigorta türleri yüklenirken hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası oluştu');
      console.error('Load insurances error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsuranceSelect = (insurance: Insurance) => {
    navigation.navigate('ApplicationForm', { insurance });
  };

  const renderInsuranceItem = ({ item }: { item: Insurance }) => (
    <TouchableOpacity
      style={styles.insuranceCard}
      onPress={() => handleInsuranceSelect(item)}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
        <Text style={styles.insuranceName}>{item.name}</Text>
      </View>
      <Text style={styles.insuranceDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.selectText}>Seç</Text>
        <Ionicons name="arrow-forward" size={16} color="#2563eb" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner text="Sigorta türleri yükleniyor..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed');
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sigorta Türü Seçin</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Size en uygun sigorta türünü seçin
        </Text>

        {insurances.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Henüz aktif sigorta türü bulunmuyor</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadInsurances}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={insurances}
            renderItem={renderInsuranceItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight + 16 : 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  insuranceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insuranceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  insuranceDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
