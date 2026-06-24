import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { baseURL } from "@/src/constants/baseURL";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Colors as AppColors } from '@/src/constants/colors';
import { CATEGORIES } from '@/src/models/categoriesModel';


export default function AddProductScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name ?? '');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [dosage, setDosage] = useState('');
  const [formField, setFormField] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [stock, setStock] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [usesText, setUsesText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setImageUrl('');
    setCategory(CATEGORIES[0]?.name ?? '');
    setDescription('');
    setPrice('');
    setBadge('');
    setDosage('');
    setFormField('');
    setManufacturer('');
    setStock('');
    setPrescriptionRequired(false);
    setUsesText('');
  };

  const onSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation', 'Please provide at least a name and price.');
      return;
    }

    const payload = {
      name: name.trim(),
      imageUrl: imageUrl.trim() || 'https://picsum.photos/seed/newproduct/900/600',
      category: category,
      description: description.trim(),
      price: Number(price) || 0,
      badge: badge.trim(),
      dosage: dosage.trim(),
      form: formField.trim(),
      manufacturer: manufacturer.trim(),
      stock: Number(stock) || 0,
      prescriptionRequired,
      uses: usesText.split(',').map((u) => u.trim()).filter(Boolean),
    };

    try {
      setSubmitting(true);

      console.log('📤 Sending payload:', payload);

      const res = await axios.post(
        `${baseURL}/products`,
        payload
      );

      console.log('✅ API RESPONSE:', res.data);

      Alert.alert('Success', 'Product uploaded');

      reset();

      router.push('/(tabs)');
    } catch (err: any) {
      console.log('❌ Upload error:', err);

      let msg = err?.message || 'Upload failed';

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        msg =
          data?.message ||
          (typeof data === 'string' ? data : JSON.stringify(data)) ||
          `${msg} (status ${status})`;
      }

      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Product</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Product name" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Image URL</Text>
        <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} placeholder="https://..." />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <Pressable style={styles.dropdown} onPress={() => setDropdownOpen((s) => !s)}>
          <Text style={styles.dropdownText}>{category}</Text>
          <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color={AppColors.text} />
        </Pressable>

        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategory(c.name);
                  setDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          placeholder="Short product description"
          multiline
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Price</Text>
          <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" placeholder="0.00" />
        </View>

        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Stock</Text>
          <TextInput value={stock} onChangeText={setStock} style={styles.input} keyboardType="numeric" placeholder="0" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Dosage</Text>
          <TextInput value={dosage} onChangeText={setDosage} style={styles.input} placeholder="e.g. 500 mg" />
        </View>

        <View style={[styles.field, styles.half]}>
          <Text style={styles.label}>Form</Text>
          <TextInput value={formField} onChangeText={setFormField} style={styles.input} placeholder="Tablet / Syrup" />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Manufacturer</Text>
        <TextInput value={manufacturer} onChangeText={setManufacturer} style={styles.input} placeholder="Manufacturer name" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Badge</Text>
        <TextInput value={badge} onChangeText={setBadge} style={styles.input} placeholder="Top sale, Rx focus..." />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Uses (comma separated)</Text>
        <TextInput value={usesText} onChangeText={setUsesText} style={styles.input} placeholder="Headache, Fever" />
      </View>

      <View style={[styles.row, styles.switchRow]}>
        <Text style={styles.label}>Prescription required</Text>
        <Switch value={prescriptionRequired} onValueChange={setPrescriptionRequired} />
      </View>

      <Pressable
        style={[styles.submitButton, submitting && styles.disabledButton]}
        onPress={onSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? 'Uploading...' : 'Upload product'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: AppColors.text },
  field: { marginBottom: 12 },
  label: { color: AppColors.text, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: AppColors.surface,
    borderColor: AppColors.soft,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: AppColors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  half: { flex: 1, marginRight: 12 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderColor: AppColors.soft,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  dropdownText: { color: AppColors.text },
  dropdownList: {
    marginTop: 8,
    backgroundColor: AppColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.soft,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.soft,
  },
  dropdownItemText: { color: AppColors.text },
  switchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.6 },
  submitText: { color: AppColors.surface, fontWeight: '700' },
});