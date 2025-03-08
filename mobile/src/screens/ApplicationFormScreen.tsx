import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Constants from 'expo-constants';
import { RootStackParamList, CreateApplicationRequest } from '../types';
import { apiService } from '../services/api';

type ApplicationFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ApplicationForm'
>;

type ApplicationFormScreenRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;

interface Props {
  navigation: ApplicationFormScreenNavigationProp;
  route: ApplicationFormScreenRouteProp;
}

export const ApplicationFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { insurance } = route.params;

  const [formData, setFormData] = useState<CreateApplicationRequest>({
    insuranceId: insurance.id,
    selectedDate: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateApplicationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (text: string) => {
    // DD/MM/YYYY formatında tarih girişi
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

    if (!match) return text;

    const [, day, month, year] = match;
    let formatted = day;
    if (month) formatted += '/' + month;
    if (year) formatted += '/' + year;

    return formatted;
  };

  const formatPhone = (text: string) => {
    // 0XXX XXX XX XX formatında telefon girişi
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,2})(\d{0,2})$/);

    if (!match) return text;

    const [, first, second, third, fourth] = match;
    let formatted = first;
    if (second) formatted += ' ' + second;
    if (third) formatted += ' ' + third;
    if (fourth) formatted += ' ' + fourth;

    return formatted;
  };

  const validateForm = (): boolean => {
    if (!formData.selectedDate) {
      Alert.alert('Hata', 'Lütfen tarih seçin');
      return false;
    }

    if (!formData.phone) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin');
      return false;
    }

    if (formData.phone.replace(/\D/g, '').length !== 11) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin');
      return false;
    }

    return true;
  };

  const convertDateToISO = (dateStr: string): string => {
    // DD/MM/YYYY -> YYYY-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const submitData = {
        ...formData,
        selectedDate: convertDateToISO(formData.selectedDate),
        phone: formData.phone.replace(/\D/g, ''),
      };

      const response = await apiService.createApplication(submitData);

      if (response.success) {
        navigation.navigate('Success', { insuranceName: insurance.name });
      } else {
        Alert.alert('Hata', 'Başvuru gönderilirken hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bağlantı hatası oluştu');
      console.error('Submit application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
          <Text style={styles.headerTitle}>Başvuru Formu</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Selected Insurance */}
          <View style={styles.selectedInsurance}>
            <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
            <View style={styles.insuranceInfo}>
              <Text style={styles.insuranceName}>{insurance.name}</Text>
              <Text style={styles.insuranceDescription}>{insurance.description}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Başvuru Bilgileri</Text>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="calendar" size={16} color="#374151" /> İstediğiniz Tarih
              </Text>
              <TextInput
                style={styles.input}
                placeholder="GG/AA/YYYY"
                value={formData.selectedDate}
                onChangeText={(text) => {
                  const formatted = formatDate(text);
                  if (formatted.length <= 10) {
                    handleInputChange('selectedDate', formatted);
                  }
                }}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="call" size={16} color="#374151" /> Telefon Numaranız
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0XXX XXX XX XX"
                value={formData.phone}
                onChangeText={(text) => {
                  const formatted = formatPhone(text);
                  if (formatted.replace(/\D/g, '').length <= 11) {
                    handleInputChange('phone', formatted);
                  }
                }}
                maxLength={14}
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Gönderiliyor...</Text>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Başvuru Gönder</Text>
                  <Ionicons name="send" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
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
  selectedInsurance: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insuranceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  insuranceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  insuranceDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
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
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
