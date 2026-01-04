import { router, useLocalSearchParams } from 'expo-router';
import { Share, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResultScreen() {
  const { title, winner } = useLocalSearchParams();

  const shareResult = async () => {
    try {
      await Share.share({
        message: `${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik.`,
      });
    } catch (error) {
      // Paylaşım başarısız olursa alert göster
      alert(`${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik.`);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title" style={{ fontSize: 32, marginBottom: 20 }}>🎉 Tebrikler! 🎉</ThemedText>
      <ThemedText style={{ fontSize: 24, marginBottom: 10 }}>{title}</ThemedText>
      <ThemedText type="title" style={{ fontSize: 28, marginBottom: 30 }}>Kazanan: {winner}</ThemedText>
      <TouchableOpacity
        style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8, marginBottom: 20 }}
        onPress={shareResult}
      >
        <ThemedText style={{ color: 'white', fontSize: 18 }}>Paylaş</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 15, backgroundColor: '#34C759', borderRadius: 8 }}
        onPress={() => router.push('/')}
      >
        <ThemedText style={{ color: 'white', fontSize: 18 }}>Ana Sayfa</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}