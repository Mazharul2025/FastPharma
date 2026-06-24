import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { baseURL } from "@/src/constants/baseURL";
import { Colors as AppColors } from '@/src/constants/colors';
import { ProductModel } from '@/src/models/productModel';

const MEDICINE_CATEGORIES = [
  'Painkillers',
  'Antimicrobial',
  'Cardiovascular',
  'Musculoskeletal',
  'Chemotherapy',
  'ENT preparations',
  'Allergy & Immune System',
  'Dermatological',
  'Supplements & Vitamins',
  'Gastrointestinal system',
];

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const drawerTranslateX = useRef(new Animated.Value(-280)).current;

  // ─── Fetch products from PC API ───────────────────────────────────────────
      const loadProducts = async (nextPage = 1) => {
  try {
    setError(null);

    console.log(`🔄 Fetching page ${nextPage}`);

    const res = await fetch(
      `${baseURL}/products?page=${nextPage}&limit=10`
    );

    console.log('📡 Response status:', res.status);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    console.log('✅ Products received:', data);

    const newProducts = Array.isArray(data.data) ? data.data : [];

    setProducts(prev =>
      nextPage === 1 ? newProducts : [...prev, ...newProducts]
    );

    setPage(nextPage);

    // check if more data exists
    const totalLoaded = nextPage * data.limit;
    setHasMore(totalLoaded < data.total);

  } catch (err) {
    console.log('❌ PRODUCT API ERROR:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch products');
  } finally {
    setLoading(false);
  }
};


useFocusEffect(
  useCallback(() => {
    console.log('🔄 Screen focused → reload products');
    loadProducts(1); // always refresh first page
  }, [])
);
  

  // ─── Drawer animation ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(drawerTranslateX, {
      toValue: drawerOpen ? 0 : -280,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen, drawerTranslateX]);

  // ─── Filter ───────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return safeProducts;
    return safeProducts.filter((product) => {
      const searchableText = `${product.name} ${product.category} ${product.form}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [products, query]);

  const selectCategory = (category: string) => {
    setQuery(category);
    setDrawerOpen(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      {/* Backdrop */}
      <Pressable
        onPress={() => setDrawerOpen(false)}
        pointerEvents={drawerOpen ? 'auto' : 'none'}
        style={[styles.backdrop, drawerOpen && styles.backdropVisible]}
      />

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Medicine Category</Text>
          <Pressable onPress={() => setDrawerOpen(false)} style={styles.drawerCloseButton}>
            <Ionicons name="close" size={18} color={AppColors.text} />
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerScrollContent}
          style={styles.drawerScroll}>
          {MEDICINE_CATEGORIES.map((category) => (
            <Pressable key={category} onPress={() => selectCategory(category)} style={styles.drawerItem}>
              <Text style={styles.drawerItemText}>{category}</Text>
              <Ionicons name="chevron-forward" size={18} color={AppColors.primary} />
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Main scroll */}
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={[1]}
        keyboardShouldPersistTaps="handled">

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.titleCluster}>
            <Pressable onPress={() => setDrawerOpen(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={22} color={AppColors.text} />
            </Pressable>
          </View>
          <Text style={styles.pageTitle}>FastPharma</Text>
          <Pressable onPress={() => router.push('/(tabs)/cart')} style={styles.cartChip}>
            <Ionicons name="bag-handle-outline" size={16} color={AppColors.primary} />
            <Text style={styles.cartChipText}>0</Text>
          </Pressable>
        </View>

        {/* Sticky search */}
        <View style={styles.stickySearchWrap}>
          <View style={styles.searchShell}>
            <Ionicons name="search" size={18} color={AppColors.primary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search medicine by name, category, or form"
              placeholderTextColor="rgba(23,49,31,0.45)"
              style={styles.searchInput}
            />
            {!!query && (
              <Pressable onPress={() => setQuery('')} style={styles.searchClearButton}>
                <Ionicons name="close" size={16} color={AppColors.primary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medicine catalog</Text>
          <Text style={styles.sectionSubtitle}>{filteredProducts.length} items</Text>
        </View>


        {/* Error message */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={AppColors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        )}

        {/* Product grid */}
        {!loading && (
          <View style={styles.grid}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.card}>
                <View style={styles.cardImageWrap}>
                  <Image source={{ uri: product.imageUrl }} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBadgePill}>
                    <Text style={styles.cardBadge}>{product.badge}</Text>
                  </View>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.cardCategory} numberOfLines={1}>{product.category}</Text>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMetaText}>{product.form}</Text>
                  <Text style={styles.cardMetaText}>{product.dosage}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>${product.price.toFixed(2)}</Text>
                  <View style={styles.cardActionRow}>
                    <Pressable
                      onPress={() => router.push({ pathname: '/medicine/[id]', params: { id: product.id } })}
                      style={styles.detailsButton}>
                      <Ionicons name="eye-outline" size={14} color={AppColors.text} />
                    </Pressable>
                    <Pressable
                      onPress={() => console.log('Add to cart:', product.id)}
                      style={styles.addButton}>
                      <Ionicons name="bag-add-outline" size={16} color={AppColors.surface} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && !error && (
          <View style={styles.emptyState}>
            <Ionicons name="search-circle-outline" size={44} color={AppColors.primary} />
            <Text style={styles.emptyTitle}>No medicine found</Text>
            <Text style={styles.emptyCopy}>Try another name, category, or clear your search.</Text>
          </View>
        )}
        {hasMore && !loading && (
  <Pressable
    onPress={() => loadProducts(page + 1)}
    style={{ padding: 12, alignItems: 'center' }}
  >
    <Text>Load More</Text>
  </Pressable>
)}
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 28, 16, 0.3)',
    opacity: 0,
    zIndex: 8,
  },
  backdropVisible: {
    opacity: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: AppColors.surface,
    borderRightWidth: 1,
    borderRightColor: AppColors.soft,
    paddingTop: 56,
    paddingHorizontal: 18,
    gap: 14,
    zIndex: 10,
    shadowColor: AppColors.text,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 6, height: 0 },
    elevation: 12,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  drawerTitle: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  drawerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerScrollContent: {
    gap: 10,
    paddingBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: AppColors.background,
  },
  drawerItemText: {
    color: AppColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 30,
    gap: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.soft,
  },
  pageTitle: {
    color: AppColors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cartChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.soft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  cartChipText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  stickySearchWrap: {
    backgroundColor: AppColors.background,
    paddingVertical: 6,
  },
  searchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.soft,
    paddingHorizontal: 12,
    minHeight: 48,
    shadowColor: AppColors.text,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: AppColors.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  searchClearButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: 'rgba(23,49,31,0.68)',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    marginBottom: 12,
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: AppColors.soft,
    gap: 8,
    shadowColor: AppColors.text,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardImageWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    height: 96,
    backgroundColor: AppColors.soft,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadgePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardBadge: {
    color: AppColors.primary,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  cardName: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  cardCategory: {
    color: 'rgba(23,49,31,0.68)',
    fontSize: 11,
    fontWeight: '600',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cardMetaText: {
    color: AppColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
  },
  addButton: {
    width: 34,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 10,
  },
  addedButton: {
    backgroundColor: '#4F8A5E',
  },
  emptyState: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.soft,
    alignItems: 'center',
    padding: 22,
    gap: 8,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyCopy: {
    color: 'rgba(23,49,31,0.66)',
    fontSize: 13,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  debugBanner: {
    backgroundColor: 'rgba(100, 180, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 180, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  debugText: {
    color: 'rgba(23,49,31,0.7)',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});