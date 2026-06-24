import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors as AppColors } from '@/src/constants/colors';
import { ProductModel } from '@/src/models/productModel';

export default function MedicineDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [medicine, setMedicine] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Product ID not found');
      setLoading(false);
      return;
    }

    async function fetchMedicine() {
      try {
        setError(null);
        const res = await fetch(`http://192.168.0.104:3000/api/products/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMedicine(data);
      } catch (err) {
        console.log('📡 FETCH MEDICINE ERROR:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch medicine');
      } finally {
        setLoading(false);
      }
    }

    fetchMedicine();
  }, [id]);

  const topBar = (
    <View style={styles.topBarWrap}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={18} color={AppColors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Medicine details</Text>
        <Pressable onPress={() => router.push('/(tabs)/cart')} style={styles.iconButton}>
          <Ionicons name="bag-handle-outline" size={18} color={AppColors.text} />
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        {topBar}
        <View style={styles.notFoundScreen}>
          <Text style={styles.notFoundTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !medicine) {
    return (
      <View style={styles.screen}>
        {topBar}
        <View style={styles.notFoundScreen}>
          <Ionicons name="alert-circle-outline" size={42} color={AppColors.primary} />
          <Text style={styles.notFoundTitle}>Medicine not found</Text>
          <Text style={styles.notFoundCopy}>{error || 'The selected medicine does not exist.'}</Text>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {topBar}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            <Image source={{ uri: medicine.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{medicine.badge}</Text>
          </View>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineCategory}>{medicine.category}</Text>
          <Text style={styles.medicineDescription}>{medicine.description}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dosage</Text>
              <Text style={styles.infoValue}>{medicine.dosage}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Form</Text>
              <Text style={styles.infoValue}>{medicine.form}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Stock</Text>
              <Text style={styles.infoValue}>{medicine.stock}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>TK{medicine.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Uses</Text>
          {medicine.uses.map((useCase) => (
            <View key={useCase} style={styles.useRow}>
              <Ionicons name="checkmark-circle" size={16} color={AppColors.primary} />
              <Text style={styles.useText}>{useCase}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Manufacturer</Text>
          <Text style={styles.sectionText}>{medicine.manufacturer}</Text>
          <Text style={styles.sectionTitle}>Prescription</Text>
          <Text style={styles.sectionText}>
            {medicine.prescriptionRequired ? 'Required before checkout' : 'Not required for this medicine'}
          </Text>
        </View>

        <Pressable
          onPress={() => console.log('Add to cart:', medicine.id)}
          style={styles.addButton}>
          <Ionicons name="bag-add-outline" size={18} color={AppColors.surface} />
          <Text style={styles.addButtonText}>Add to cart</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 14,
    paddingBottom: 32,
    paddingTop: 8,
  },
  topBarWrap: {
    backgroundColor: AppColors.background,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.soft,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    color: AppColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.primary,
    borderWidth: 1,
    borderColor: AppColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: AppColors.surface,
    fontSize: 10,
    fontWeight: '900',
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 18,
    gap: 10,
  },
  heroImageWrap: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: AppColors.soft,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.soft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
    color: AppColors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  medicineName: {
    color: AppColors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  medicineCategory: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  medicineDescription: {
    color: 'rgba(23,49,31,0.74)',
    fontSize: 14,
    lineHeight: 21,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  infoItem: {
    width: '47%',
    backgroundColor: AppColors.background,
    borderRadius: 14,
    padding: 10,
    gap: 4,
  },
  infoLabel: {
    color: 'rgba(23,49,31,0.62)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionCard: {
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.soft,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    color: AppColors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionText: {
    color: 'rgba(23,49,31,0.74)',
    fontSize: 14,
    lineHeight: 20,
  },
  useRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  useText: {
    color: 'rgba(23,49,31,0.82)',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: AppColors.primary,
  },
  addedButton: {
    backgroundColor: '#4F8A5E',
  },
  addButtonText: {
    color: AppColors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  notFoundScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
    gap: 10,
  },
  notFoundTitle: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  notFoundCopy: {
    color: 'rgba(23,49,31,0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: AppColors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
});
