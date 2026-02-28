import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KhatamHistoryScreen() {
  const { khatamHistory } = useProgress();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleDateString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.history.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons name="trophy" size={40} color={AppColors.gold} />
          <Text style={styles.summaryCount}>{khatamHistory.totalCount}</Text>
          <Text style={styles.summaryLabel}>{t.history.totalKhatam}</Text>
        </View>

        {khatamHistory.completions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="book-open-variant" size={48} color={AppColors.inactive} />
            <Text style={styles.emptyText}>{t.history.noHistory}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {khatamHistory.completions.map((completion, index) => (
              <Pressable
                key={completion.id}
                onPress={() => setExpandedId(expandedId === completion.id ? null : completion.id)}
                style={styles.item}
              >
                <View style={styles.itemNumber}>
                  <Text style={styles.itemNumberText}>#{khatamHistory.completions.length - index}</Text>
                </View>
                <View style={styles.itemContent}>
                  <View style={styles.itemTop}>
                    <View style={styles.itemLeft}>
                      <Text style={styles.date}>{formatDate(completion.completedAt)}</Text>
                      <MaterialCommunityIcons
                        name={expandedId === completion.id ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={AppColors.textSecondary}
                      />
                    </View>
                    <Text style={styles.days}>
                      {completion.totalDays} {t.history.daysTaken}
                    </Text>
                  </View>
                  {expandedId === completion.id && (
                    <View style={styles.detail}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color={AppColors.textSecondary} />
                      <Text style={styles.detailText}>{formatTime(completion.completedAt)}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  summaryCount: {
    fontSize: 48,
    fontWeight: '700',
    color: AppColors.primary,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  itemNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primary,
  },
  itemContent: {
    flex: 1,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  days: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  bottomSpacer: {
    height: 20,
  },
});
