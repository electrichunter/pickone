import { router } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const templates = [
  { id: '1', title: 'Akşam Yemeği', options: ['Pizza', 'Burger', 'Kebap', 'Salata', 'Çorba'] },
  { id: '2', title: 'Film Türleri', options: ['Aksiyon', 'Komedi', 'Dram', 'Korku', 'Romantik'] },
  { id: '3', title: 'Doğruluk mu Cesaret mi?', options: ['Doğruluk', 'Cesaret'] },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Pick One</ThemedText>
      <ThemedText style={styles.subtitle}>Hazır şablonlar</ThemedText>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.templateItem} onPress={() => router.push({ pathname: '/spin' as any, params: { title: item.title, options: JSON.stringify(item.options) } })}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <ThemedText>{item.options.join(', ')}</ThemedText>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create' as any)}>
        <ThemedText type="subtitle" style={styles.createText}>Yeni Liste Oluştur</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  templateItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  createButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createText: {
    color: 'white',
  },
});
