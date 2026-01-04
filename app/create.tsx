import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const startSpin = () => {
    if (!title.trim() || options.filter(o => o.trim()).length < 2) {
      Alert.alert('Hata', 'Başlık ve en az 2 seçenek girin.');
      return;
    }
    const filteredOptions = options.filter(o => o.trim());
    router.push({ pathname: '/spin' as any, params: { title, options: JSON.stringify(filteredOptions) } });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Yeni Liste Oluştur</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
      />
      <ThemedText style={styles.subtitle}>Seçenekler</ThemedText>
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.optionRow}>
            <TextInput
              style={styles.optionInput}
              placeholder={`Seçenek ${index + 1}`}
              value={item}
              onChangeText={(text) => {
                const newOptions = [...options];
                newOptions[index] = text;
                setOptions(newOptions);
              }}
            />
            {options.length > 2 && (
              <TouchableOpacity onPress={() => removeOption(index)} style={styles.removeButton}>
                <ThemedText style={styles.removeText}>Sil</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        )}
      />
      <ThemedView style={styles.addRow}>
        <TextInput
          style={styles.optionInput}
          placeholder="Yeni seçenek"
          value={newOption}
          onChangeText={setNewOption}
        />
        <TouchableOpacity onPress={addOption} style={styles.addButton}>
          <ThemedText style={styles.addText}>Ekle</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <TouchableOpacity style={styles.spinButton} onPress={startSpin}>
        <ThemedText style={styles.spinText}>Çarkı Çevir</ThemedText>
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  removeText: {
    color: 'white',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  addText: {
    color: 'white',
  },
  spinButton: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  spinText: {
    color: 'white',
    fontSize: 18,
  },
});