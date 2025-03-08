import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type SuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Success'>;
type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;

interface Props {
  navigation: SuccessScreenNavigationProp;
  route: SuccessScreenRouteProp;
}

export const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { insuranceName } = route.params;

  const handleNewApplication = () => {
    navigation.navigate('InsuranceSelection');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={120} color="#10b981" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Başvurunuz Alındı!</Text>

        <Text style={styles.message}>
          <Text style={styles.boldText}>{insuranceName}</Text> sigortası için başvurunuz başarıyla gönderildi.
        </Text>

        <Text style={styles.info}>
          En kısa sürede sizinle iletişime geçeceğiz.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNewApplication}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Yeni Başvuru Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
          >
            <Ionicons name="home-outline" size={20} color="#2563eb" />
            <Text style={styles.secondaryButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.contactText}>
            Acil durumlar için: +90 (212) 555-0123
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '600',
    color: '#1f2937',
  },
  info: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
});
