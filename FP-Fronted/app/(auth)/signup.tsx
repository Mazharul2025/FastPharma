import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';
import { baseURL } from "@/src/constants/baseURL";

import { Colors as AppColors } from '@/src/constants/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = Array.isArray(redirect) ? redirect[0] : redirect;

  async function handleSignUp() {
    try {
      setLoading(true);

      const res = await axios.post(
        `${baseURL}/auth/register`,
        {
          name,
          email,
          mobile,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", res.data.message || "Account created");

      router.replace(redirectPath || "/(tabs)");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Network error or server issue";

      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        <View style={styles.brandMark}>
          <Ionicons name="sparkles" size={26} color={AppColors.primary} />
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Join FastPharma and start ordering medicines easily.
        </Text>

        {/* NAME */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="rgba(23,49,31,0.38)"
            style={styles.input}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="rgba(23,49,31,0.38)"
            style={styles.input}
          />
        </View>

        {/* MOBILE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
            placeholderTextColor="rgba(23,49,31,0.38)"
            style={styles.input}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            placeholderTextColor="rgba(23,49,31,0.38)"
            style={styles.input}
          />
        </View>

        {/* BUTTON */}
        <Pressable
          onPress={handleSignUp}
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating..." : "Sign up"}
          </Text>
        </Pressable>

        {/* SIGN IN */}
        <Pressable
          onPress={() =>
            router.push(
              redirectPath
                ? {
                    pathname: '/(auth)/signin',
                    params: { redirect: redirectPath },
                  }
                : '/(auth)/signin'
            )
          }
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* =========================
   STYLES (unchanged)
========================= */
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
    left: -70,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: AppColors.soft,
  },
  glowTwo: {
    position: 'absolute',
    bottom: 60,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(137,183,123,0.18)',
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 22,
    gap: 14,
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
    fontSize: 28,
    fontWeight: '900',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(23,49,31,0.7)',
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.text,
  },
  input: {
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.soft,
    borderRadius: 14,
    padding: 12,
    color: AppColors.text,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: AppColors.primary,
    fontWeight: '700',
  },
});