import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { JuzProgress } from '@/types';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import ProgressRing from './ProgressRing';

interface JuzCardProps {
  juzProgress: JuzProgress;
}

export default function JuzCard({ juzProgress }: JuzCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { juz, pagesRead, totalPages, percentage } = juzProgress;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/juz/${juz.id}` as any)}>
      <View style={styles.juzNumber}>
        <Text style={styles.juzNumberText}>{juz.id}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nameAr}>{juz.nameAr}</Text>
        <Text style={styles.nameEn}>{juz.nameEn}</Text>
        <Text style={styles.pageRange}>
          {t.juzDetail.pagesRange} {juz.startPage} - {juz.endPage}
        </Text>
        <Text style={styles.pages}>
          {pagesRead}/{totalPages} {t.progress.pages}
        </Text>
      </View>
      <ProgressRing percentage={percentage} size={48} strokeWidth={4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
  },
  juzNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  juzNumberText: {
    color: AppColors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  nameAr: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 1,
  },
  nameEn: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 2,
  },
  pageRange: {
    fontSize: 11,
    color: AppColors.secondary,
    fontWeight: '500',
    marginBottom: 1,
  },
  pages: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
});
