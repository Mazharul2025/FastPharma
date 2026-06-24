import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors as AppColors } from '@/src/constants/colors';
import { useAppStore } from '@/src/store/app-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSignedIn } = useAppStore();
  const [name, setName] = useState('Green Shopper');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/(auth)/signup?redirect=/(tabs)/profile');
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return null;
  }

  function handleSave() {
    Alert.alert('Saved', 'Your profile details were updated.');
  }

  function handleSignOut() {
    Alert.alert('Signed out');
    router.replace('/(auth)/signin');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>User details</Text>
        <Text style={styles.headerSubtitle}>Edit your name, phone number, and address.</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor="rgba(23,49,31,0.38)"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Your contact number"
            placeholderTextColor="rgba(23,49,31,0.38)"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Your delivery address"
            placeholderTextColor="rgba(23,49,31,0.38)"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
          />
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save details</Text>
        </Pressable>

        <Pressable onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 14,
  },
  headerCard: {
    backgroundColor: AppColors.primary,
    borderRadius: 24,
    padding: 18,
    gap: 6,
  },
  headerTitle: {
    color: AppColors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 16,
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: AppColors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.soft,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: AppColors.text,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  actionsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 16,
    gap: 10,
  },
  saveButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 13,
  },
  saveButtonText: {
    color: AppColors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  signOutButton: {
    backgroundColor: AppColors.soft,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 13,
  },
  signOutButtonText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});
