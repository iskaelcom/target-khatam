import DonutChart from '@/components/charts/DonutChart';
import DailyRecap from '@/components/DailyRecap';
import DailyTargetCard from '@/components/DailyTargetCard';
import KhatamHistoryCard from '@/components/KhatamHistoryCard';
import { AppColors } from '@/constants/Colors';
import { TOTAL_PAGES } from '@/constants/quranData';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { Translations } from '@/i18n/en';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function getMotivation(percentage: number, t: Translations) {
  if (percentage === 0) return t.home.motivation.zero;
  if (percentage < 25) return t.home.motivation.low;
  if (percentage < 75) return t.home.motivation.mid;
  if (percentage < 100) return t.home.motivation.high;
  return t.home.motivation.done;
}

export default function HomeScreen() {
  const { readPages, overallProgress, isLoading, markUpToPage, startNewKhatam, khatamHistory } = useProgress();
  const { t, language } = useLanguage();
  const [pageInput, setPageInput] = useState('');

  const handleStartAgain = useCallback(() => {
    if (Platform.OS === 'web') {
      if (window.confirm(t.history.startAgainConfirm)) {
        startNewKhatam();
      }
    } else {
      Alert.alert(
        t.history.startAgain,
        t.history.startAgainConfirm,
        [
          { text: t.common.cancel, style: 'cancel' },
          { text: t.common.confirm, onPress: () => startNewKhatam() },
        ]
      );
    }
  }, [t, startNewKhatam]);

  const handleMarkPage = useCallback(() => {
    const page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 1 || page > TOTAL_PAGES) {
      if (Platform.OS === 'web') {
        window.alert(t.home.invalidPage);
      } else {
        Alert.alert('', t.home.invalidPage);
      }
      return;
    }
    markUpToPage(page);
    setPageInput('');
  }, [pageInput, markUpToPage, t]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t.app.title}</Text>
            <Text style={styles.subtitle}>{t.home.subtitle}</Text>
          </View>
          {khatamHistory.totalCount > 0 && (
            <View style={styles.khatamBadge}>
              <MaterialCommunityIcons name="trophy" size={22} color={AppColors.gold} />
              <Text style={styles.khatamBadgeText}>{khatamHistory.totalCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>{t.home.overallProgress}</Text>
          <DonutChart
            percentage={overallProgress.percentage}
            pagesRead={overallProgress.pagesRead}
            totalPages={overallProgress.totalPages}
          />
          <Text style={styles.motivation}>
            {getMotivation(overallProgress.percentage, t)}
          </Text>
          {overallProgress.percentage === 100 && (
            <Pressable
              style={({ pressed }) => [styles.startAgainButton, pressed && styles.startAgainButtonPressed]}
              onPress={handleStartAgain}
            >
              <MaterialCommunityIcons name="restart" size={20} color={AppColors.white} />
              <Text style={styles.startAgainText}>{t.history.startAgain}</Text>
            </Pressable>
          )}
        </View>




        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>{t.home.manualInput}</Text>
          <View style={styles.inputCard}>
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={AppColors.primary} />
            <TextInput
              style={styles.textInput}
              placeholder={t.home.inputPlaceholder}
              placeholderTextColor={AppColors.textSecondary}
              keyboardType="number-pad"
              value={pageInput}
              onChangeText={setPageInput}
              onSubmitEditing={handleMarkPage}
              returnKeyType="done"
            />
            <Pressable
              style={({ pressed }) => [styles.markButton, pressed && styles.markButtonPressed]}
              onPress={handleMarkPage}>
              <Text style={styles.markButtonText}>{t.home.markRead}</Text>
            </Pressable>
          </View>
          {readPages.length > 0 && (
            <View style={styles.lastPageInfo}>
              <MaterialCommunityIcons name="bookmark-check" size={16} color={AppColors.secondary} />
              <Text style={styles.lastPageText}>
                {t.home.lastPageRead}: <Text style={styles.lastPageNumber}>{readPages[readPages.length - 1]}</Text>
              </Text>
            </View>
          )}
        </View>

        <DailyTargetCard />
        <KhatamHistoryCard />

        <DailyRecap />

        <View style={styles.hadithCard}>
          <Text style={styles.hadithOrnament}>✦</Text>
          <Text style={styles.hadithArabic}>
            أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ
          </Text>
          <View style={styles.hadithDivider} />
          <Text style={styles.hadithTranslation}>
            {language === 'id'
              ? '"Amalan yang paling dicintai oleh Allah Ta\'ala adalah amalan yang kontinu (istiqomah) walaupun itu sedikit."'
              : '"The most beloved deeds to Allah are those done consistently, even if they are few."'}
          </Text>
          <Text style={styles.hadithSource}>— HR. Muslim no. 783</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  khatamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  khatamBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gold,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  chartSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  motivation: {
    fontSize: 15,
    color: AppColors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  startAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  startAgainButtonPressed: {
    opacity: 0.8,
  },
  startAgainText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  inputSection: {
    paddingTop: 16,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    backgroundColor: AppColors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  markButtonPressed: {
    opacity: 0.8,
  },
  markButtonText: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  lastPageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  lastPageText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  lastPageNumber: {
    fontWeight: '700',
    color: AppColors.primary,
  },
  hadithCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.primary + '28',
  },
  hadithOrnament: {
    fontSize: 14,
    color: AppColors.secondary,
    marginBottom: 12,
  },
  hadithArabic: {
    fontSize: 21,
    color: AppColors.primary,
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: '600',
    marginBottom: 14,
  },
  hadithDivider: {
    width: 56,
    height: 1.5,
    backgroundColor: AppColors.secondary,
    marginBottom: 14,
  },
  hadithTranslation: {
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  hadithSource: {
    fontSize: 12,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});
