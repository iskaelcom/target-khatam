import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProgress } from '@/context/ProgressContext';
import { useLanguage } from '@/context/LanguageContext';
import { getJuzById } from '@/utils/progress';
import { AppColors } from '@/constants/Colors';
import ProgressRing from '@/components/ProgressRing';
import PageGrid from '@/components/PageGrid';

export default function JuzDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { juzProgress, markJuz } = useProgress();
  const { t } = useLanguage();

  const juzId = parseInt(id, 10);
  const juz = getJuzById(juzId);

  if (!juz) return null;

  const progress = juzProgress.find((jp) => jp.juz.id === juzId);
  const percentage = progress?.percentage ?? 0;
  const pagesRead = progress?.pagesRead ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={AppColors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Juz {juz.id}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.juzInfo}>
          <Text style={styles.nameAr}>{juz.nameAr}</Text>
          <Text style={styles.nameEn}>{juz.nameEn}</Text>
          <Text style={styles.pageRange}>
            {t.juzDetail.pagesRange} {juz.startPage} - {juz.endPage}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <ProgressRing percentage={percentage} size={80} strokeWidth={6} />
          <Text style={styles.progressText}>
            {pagesRead}/{juz.totalPages} {t.progress.pages}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.readButton]}
            onPress={() => markJuz(juzId, 'read')}>
            <MaterialCommunityIcons name="check-all" size={18} color={AppColors.white} />
            <Text style={styles.actionTextWhite}>{t.juzDetail.markAllRead}</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.unreadButton]}
            onPress={() => markJuz(juzId, 'unread')}>
            <MaterialCommunityIcons name="close" size={18} color={AppColors.textSecondary} />
            <Text style={styles.actionTextGray}>{t.juzDetail.markAllUnread}</Text>
          </Pressable>
        </View>

        <View style={styles.gridSection}>
          <Text style={styles.gridTitle}>{t.juzDetail.page}</Text>
          <PageGrid startPage={juz.startPage} endPage={juz.endPage} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  juzInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  nameAr: {
    fontSize: 28,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  nameEn: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  pageRange: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  readButton: {
    backgroundColor: AppColors.primary,
  },
  unreadButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.inactive,
  },
  actionTextWhite: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.white,
  },
  actionTextGray: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  gridSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
