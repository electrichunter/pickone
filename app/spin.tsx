import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av'; // expo-av kütüphanesini kullanarak ses çalma işlemi için import edildi (deprecated olsa da çalışıyor)
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, Share, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');
const wheelSize = width * 0.8;

const colors = ['#FF0080', '#00FF80', '#0080FF', '#FF8000', '#8000FF', '#FF4040', '#40FF40', '#4040FF']; // Canlı neon renkler

export default function SpinScreen() {
  const { title, options: optionsStr } = useLocalSearchParams();
  const options: string[] = JSON.parse(optionsStr as string);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const rotation = useSharedValue(0); // Çark başlangıç rotasyonu
  const viewShotRef = useRef<ViewShot>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const spinWheel = async () => {
    try {
      if (isSpinning) return;
      setIsSpinning(true);
      setWinner(null);

      let sound: any = null;
      try {
        // expo-av kütüphanesini kullanarak ses dosyasını yükle ve çal
        const soundObj = await (Audio as any).Sound.createAsync(require('@/assets/sounds/gear-click-351962.mp3')); // MP3 dosyasını yükle
        sound = soundObj.sound;
        await sound.playAsync(); // Sesi çal
      } catch (error) {
        console.log('Sound error:', error); // Hata durumunda logla
      }

      // Vibrate
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Calculate random angle
      const randomIndex = Math.floor(Math.random() * options.length);
      const anglePerSegment = 360 / options.length;
      const winner_center = randomIndex * anglePerSegment + anglePerSegment / 2;
      const targetAngle = ((270 - winner_center) % 360 + 360) % 360; // Kazanan segmenti oka (270 derece, üst) getirmek için
      console.log('Winner:', options[randomIndex], 'index:', randomIndex, 'center:', winner_center, 'targetAngle:', targetAngle);
      const fullRotations = 5 + Math.random() * 5; // 5-10 full rotations
      const finalRotation = rotation.value + fullRotations * 360 + targetAngle;

      console.log('Spinning wheel with finalRotation:', finalRotation, 'winner index:', randomIndex);

      rotation.value = withTiming(finalRotation, { duration: 3000 });

      // Dönüş sırasında titreşim ekle
      const hapticInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 400);

      setTimeout(() => {
        clearInterval(hapticInterval);
        console.log('Timeout finished, setting winner:', options[randomIndex]);
        setWinner(options[randomIndex]);
        setIsSpinning(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Durma hissi

        // Save to history
        const historyItem = {
          title: title as string,
          winner: options[randomIndex],
          date: new Date().toLocaleString(),
        };
        AsyncStorage.getItem('spinHistory').then((stored) => {
          const history = stored ? JSON.parse(stored) : [];
          history.unshift(historyItem); // Add to beginning
          AsyncStorage.setItem('spinHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
        }).catch((error) => console.error('Error saving history:', error));
      }, 3100);
    } catch (error) {
      console.error('Error in spinWheel:', error);
    }
  };

  const renderWheel = () => {
    const center = wheelSize / 2;
    const radius = center - 20;
    const anglePerSegment = 360 / options.length;

    return (
      <Svg width={wheelSize} height={wheelSize}>
        {/* Çark kenar çerçevesi */}
        <Circle cx={center} cy={center} r={center - 15} stroke="#333" strokeWidth="3" fill="none" />
        <G x={center} y={center}>
          {options.map((option, index) => {
            const startAngle = index * anglePerSegment;
            const endAngle = (index + 1) * anglePerSegment;
            const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

            const x1 = radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = radius * Math.sin((endAngle * Math.PI) / 180);

            const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const textAngle = startAngle + anglePerSegment / 2;
            const textX = (radius * 0.7) * Math.cos((textAngle * Math.PI) / 180);
            const textY = (radius * 0.7) * Math.sin((textAngle * Math.PI) / 180);

            return (
              <G key={index}>
                <Path d={pathData} fill={colors[index % colors.length]} />
                <SvgText
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                >
                  {option}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    );
  };

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
      <ThemedView style={[styles.container, { padding: 10 }]}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        <Animated.View style={[styles.wheelContainer, animatedStyle]}>
          {renderWheel()}
        </Animated.View>
        {/* <Svg width={wheelSize} height={wheelSize} style={styles.arrowContainer}>
          <Path d={`M ${wheelSize / 2} 40 L ${wheelSize / 2 - 20} 0 L ${wheelSize / 2 + 20} 0 Z`} fill="red" stroke="yellow" strokeWidth="4" />
        </Svg> */}
        <TouchableOpacity style={styles.spinButton} onPress={spinWheel} disabled={isSpinning}>
          <ThemedText style={styles.spinText}>{isSpinning ? 'Çeviriliyor...' : 'Çevir'}</ThemedText>
        </TouchableOpacity>
        {winner && (
          <ThemedView style={styles.result}>
            <ThemedText type="title" style={styles.winnerText}>Kazanan: {winner}</ThemedText>
            <TouchableOpacity style={styles.shareButton} onPress={async () => {
              console.log('Share button pressed');
              try {
                const uri = await viewShotRef.current?.capture?.();
                await Share.share({
                  message: `${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik. İndir: https://play.google.com/store/apps/details?id=com.pickone.app`,
                  url: uri,
                });
                console.log('Share successful');
              } catch (error) {
                console.error('Share error:', error);
                alert(`${title} için kazanan: ${winner}! Pick One uygulaması ile karar verdik. İndir: https://play.google.com/store/apps/details?id=com.pickone.app`);
              }
            }}>
              <IconSymbol name="square.and.arrow.up" color="white" size={24} />
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  wheelContainer: {
    marginBottom: 40,
    marginTop: 40,
    elevation: 5, // Gölge efekti ekle
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  /* arrowContainer: {
    position: 'absolute',
    top: 70, // Ok konumunu ayarlamak için bu değeri değiştirin
    left: '50%',
    marginLeft: -wheelSize / 2,
  }, */
  spinButton: {
    padding: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    alignItems: 'center',
    width: 250,
    height: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  spinText: {
    color: 'white',
    fontSize: 18,
  },
  result: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'transparent', // Arka plan ile aynı olması için saydam yap
  },
  winnerText: {
    fontSize: 24,
    marginBottom: 10,
  },
  shareButton: {
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 25,
    alignItems: 'center',
    width: 150,
    height: 60,
  },
});