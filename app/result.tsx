import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Share, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ResultScreen() {
  const { title, winner } = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);

  const shareResult = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      await Share.share({
        message: `${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik. İndir: https://play.google.com/store/apps/details?id=com.pickone.app`,
        url: uri,
      });
    } catch (error) {
      // Paylaşım başarısız olursa alert göster
      alert(`${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik. İndir: https://play.google.com/store/apps/details?id=com.pickone.app`);
    }
  };

  return (
    <ViewShot 
      ref={viewShotRef} 
      options={{ format: 'png', quality: 0.9 }}
      // ÖNEMLİ 1: ViewShot'ın kendi arka planını şeffaf yapıyoruz
      style={{ flex: 1, backgroundColor: 'transparent' }} 
    >
      <ThemedView 
        style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 20,
          // ÖNEMLİ 2: ThemedView normalde tema rengini basar, bunu şeffaf yapmalıyız
          backgroundColor: 'transparent' 
        }}
      >
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
    </ViewShot>
  );
}