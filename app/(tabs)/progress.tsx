import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/context/ProgressContext';
import { useLanguage } from '@/context/LanguageContext';
import { AppColors } from '@/constants/Colors';
import JuzBarChart from '@/components/charts/JuzBarChart';
import JuzCard from '@/components/JuzCard';

type Filter = 'all' | 'completed' | 'inProgress' | 'notStarted';

export default function ProgressScreen() {
  const { juzProgress } = useProgress();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.progress.all },
    { key: 'completed', label: t.progress.completed },
    { key: 'inProgress', label: t.progress.inProgress },
    { key: 'notStarted', label: t.progress.notStarted },
  ];

  const filteredJuz = useMemo(() => {
    switch (filter) {
      case 'completed':
        return juzProgress.filter((jp) => jp.percentage === 100);
      case 'inProgress':
        return juzProgress.filter((jp) => jp.percentage > 0 && jp.percentage < 100);
      case 'notStarted':
        return juzProgress.filter((jp) => jp.percentage === 0);
      default:
        return juzProgress;
    }
  }, [juzProgress, filter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.progress.title}</Text>
        </View>

        <JuzBarChart juzProgress={juzProgress} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {filters.map((f) => (
            <Pressable
              key={f.key}
              style={[styles.filterButton, filter === f.key && styles.filterButtonActive]}
              onPress={() => setFilter(f.key)}>
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredJuz.map((jp) => (
          <JuzCard key={jp.juz.id} juzProgress={jp} />
        ))}

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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  filterButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  filterTextActive: {
    color: AppColors.white,
  },
  bottomSpacer: {
    height: 20,
  },
});
