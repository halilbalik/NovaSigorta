import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminApi } from '../services/api';
import { RootStackParamList } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Props {
  navigation: NavigationProp<RootStackParamList, 'AdminInsuranceForm'>;
  route: RouteProp<RootStackParamList, 'AdminInsuranceForm'>;
}

const AdminInsuranceFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token } = useAdminAuth();
  const { insurance } = route.params;
  const isEditing = !!insurance;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(insurance?.name || '');
  const [description, setDescription] = useState(insurance?.description || '');
  const [isActive, setIsActive] = useState(insurance?.isActive ?? true);

  const handleSave = async () => {
    if (!token) return;

    if (!name.trim()) {
      Alert.alert('Hata', 'Sigorta adı boş olamaz');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Hata', 'Sigorta açıklaması boş olamaz');
      return;
    }

    setLoading(true);
    try {
      const insuranceData = {
        name: name.trim(),
        description: description.trim(),
        isActive,
      };

      let response;
      if (isEditing && insurance) {
        response = await adminApi.updateInsurance(token, insurance.id, insuranceData);
      } else {
        response = await adminApi.createInsurance(token, insuranceData);
      }

      if (response.success) {
        Alert.alert(
          'Başarılı',
          isEditing ? 'Sigorta güncellendi' : 'Sigorta eklendi',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Hata', response.message || 'İşlem gerçekleştirilemedi');
      }
    } catch (error) {
      console.error('Save insurance error:', error);
      Alert.alert('Hata', 'İşlem sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (hasChanges()) {
      Alert.alert(
        'Değişiklikleri Kaydet',
        'Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?',
        [
          { text: 'Kalın', style: 'cancel' },
          { text: 'Çık', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const hasChanges = () => {
    if (!isEditing) {
      return name.trim() !== '' || description.trim() !== '';
    }
    return (
      name.trim() !== insurance?.name ||
      description.trim() !== insurance?.description ||
      isActive !== insurance?.isActive
    );
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
          <Text style={styles.backButtonText}>← İptal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Sigorta Düzenle' : 'Yeni Sigorta'}
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sigorta Adı *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Sigorta adını girin"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Açıklama *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Sigorta açıklamasını girin"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.label}>Durum</Text>
              <Text style={styles.switchDescription}>
                {isActive ? 'Sigorta aktif ve kullanıcılar görebilir' : 'Sigorta pasif ve gizli'}
              </Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#f3f4f6', true: '#10b981' }}
              thumbColor={isActive ? '#ffffff' : '#ffffff'}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📝 Not:</Text>
          <Text style={styles.infoText}>
            • Sigorta adı ve açıklaması zorunludur{'\n'}
            • Pasif sigortalar kullanıcılar tarafından görülemez{'\n'}
            • Değişiklikleri kaydetmeyi unutmayın
          </Text>
        </View>
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
    color: '#ef4444',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
});

export default AdminInsuranceFormScreen;
