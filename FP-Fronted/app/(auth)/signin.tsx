import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors as AppColors } from '@/src/constants/colors';

export default function SignInScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [email, setEmail] = useState('demo@greenmarket.com');
  const [password, setPassword] = useState('green1234');
  const redirectPath = Array.isArray(redirect) ? redirect[0] : redirect;

  function handleSignIn() {
    Alert.alert('Signed in', 'Welcome back!');
    router.replace(redirectPath || '/(tabs)');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        <View style={styles.brandMark}>
          <Ionicons name="leaf" size={26} color={AppColors.primary} />
        </View>

        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Welcome back. Continue to your green storefront.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor="rgba(23,49,31,0.38)"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="rgba(23,49,31,0.38)"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable onPress={handleSignIn} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push(
              redirectPath
                ? {
                    pathname: '/(auth)/signup',
                    params: { redirect: redirectPath },
                  }
                : '/(auth)/signup'
            )
          }
          style={styles.linkButton}>
          <Text style={styles.linkText}>Need an account? Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    padding: 18,
  },
  glowOne: {
    position: 'absolute',
    top: 40,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: AppColors.soft,
  },
  glowTwo: {
    position: 'absolute',
    bottom: 50,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(137,183,123,0.18)',
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 22,
    gap: 14,
    shadowColor: AppColors.text,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: AppColors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: AppColors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: 'rgba(23,49,31,0.68)',
    fontSize: 14,
    lineHeight: 21,
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
    borderWidth: 1,
    borderColor: AppColors.soft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: AppColors.text,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: AppColors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  linkButton: {
    alignItems: 'center',
    paddingTop: 4,
  },
  linkText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});