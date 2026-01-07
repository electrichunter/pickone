import { router } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const templates = [
  { id: '1', title: 'Akşam Yemeği', options: ['Pizza', 'Burger', 'Kebap', 'Salata', 'Çorba'], icon: 'restaurant' },
  { id: '2', title: 'Film Türleri', options: ['Aksiyon', 'Komedi', 'Dram', 'Korku', 'Romantik'], icon: 'movie' },
  { id: '3', title: 'Doğruluk mu Cesaret mi?', options: ['Doğruluk', 'Cesaret'], icon: 'help' },
  { id: '4', title: 'Bu Hafta Sonu Ne Yapalım?', options: ['Sinema', 'Piknik', 'Evde Film', 'Spor', 'Alışveriş'], icon: 'weekend' },
  { id: '5', title: 'İlk Buluşma Soruları', options: ['Nerede Tanıştık?', 'En Sevdiğin Yemek?', 'Hayalindeki Tatil?', 'En Büyük Korkun?', 'Gelecek Planların?'], icon: 'favorite' },
  { id: '6', title: 'Hesabı Kim Ödeyecek?', options: ['Ben Öderim', 'Paylaşalım', 'Sen Öde', 'Kuraya Bırak'], icon: 'payment' },
  { id: '7', title: 'Şarkı Söyleme Cezası', options: ['Pop Şarkısı', 'Rock Şarkısı', 'Türkü', 'Rap', 'Klasik Müzik'], icon: 'music_note' },
  { id: '8', title: 'Hangi Diziyi İzleyelim?', options: ['Aksiyon Dizisi', 'Komedi Dizisi', 'Belgesel', 'Gerilim', 'Romantik Dizi'], icon: 'tv' },
  { id: '9', title: 'Bugün Ne Giysem?', options: ['Kot Pantolon', 'Elbise', 'Şort', 'Etek', 'Tayt'], icon: 'checkroom' },
  { id: '10', title: 'Çekiliş Yap', options: ['1. Kişi', '2. Kişi', '3. Kişi', '4. Kişi', '5. Kişi'], icon: 'casino' },
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
            <ThemedView style={styles.templateHeader}>
              {item.icon && <IconSymbol name={item.icon} size={24} color="#007AFF" style={styles.icon} />}
              <ThemedText type="subtitle">{item.title}</ThemedText>
            </ThemedView>
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
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
});
