import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors as AppColors } from '@/src/constants/colors';

export default function CartScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.emptyState}>
        <Ionicons name="bag-handle-outline" size={48} color={AppColors.primary} />
        <Text style={styles.emptyTitle}>Cart is empty</Text>
        <Text style={styles.emptyCopy}>Go to home and add medicines to your cart.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  emptyState: {
    alignItems: 'center',
    gap: 14,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyCopy: {
    color: 'rgba(23,49,31,0.66)',
    fontSize: 14,
    textAlign: 'center',
  },
});