import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Language } from '@/types';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const options: { key: Language; label: string }[] = [
    { key: 'id', label: 'Bahasa Indonesia' },
    { key: 'en', label: 'English' },
  ];

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <Pressable
          key={opt.key}
          style={[styles.button, language === opt.key && styles.buttonActive]}
          onPress={() => setLanguage(opt.key)}>
          <Text style={[styles.buttonText, language === opt.key && styles.buttonTextActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  buttonActive: {
    backgroundColor: AppColors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  buttonTextActive: {
    color: AppColors.white,
  },
});
