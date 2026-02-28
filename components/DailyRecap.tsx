import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, type ScrollView as ScrollViewType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProgress } from '@/context/ProgressContext';
import { useLanguage } from '@/context/LanguageContext';
import { AppColors } from '@/constants/Colors';

type Period = 7 | 14 | 30;

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${dd}`);
  }
  return days;
}

function getDayLabel(dateStr: string, language: string, period: Period): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (period <= 7) {
    if (diff === 0) return language === 'id' ? 'Hari ini' : 'Today';
    if (diff === 1) return language === 'id' ? 'Kemarin' : 'Yest.';
    const dayNames = language === 'id'
      ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[date.getDay()];
  }

  // For 14/30 days, show date number
  const day = date.getDate();
  const monthNames = language === 'id'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${monthNames[date.getMonth()]}`;
}

function getBarHeight(value: number, maxValue: number): number {
  if (maxValue === 0) return 4;
  return Math.max(4, (value / maxValue) * 80);
}

export default function DailyRecap() {
  const { todayPages, dailyLog } = useProgress();
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState<Period>(7);

  const periodLabel = {
    7: t.home.last7Days,
    14: t.home.last14Days,
    30: t.home.last30Days,
  };

  const days = useMemo(() => getLastNDays(period), [period]);

  const { maxPages, totalPeriod } = useMemo(() => {
    let max = 0;
    let total = 0;
    for (const day of days) {
      const val = dailyLog[day] || 0;
      if (val > max) max = val;
      total += val;
    }
    return { maxPages: max, totalPeriod: total };
  }, [dailyLog, days]);

  const showEveryNthLabel = 1;
  const scrollRef = useRef<ScrollViewType>(null);

  const handleContentSizeChange = useCallback((contentWidth: number) => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.home.dailyRecap}</Text>

      <View style={styles.todayCard}>
        <MaterialCommunityIcons name="calendar-today" size={32} color={AppColors.primary} />
        <View style={styles.todayInfo}>
          <Text style={styles.todayCount}>{todayPages}</Text>
          <Text style={styles.todayLabel}>{t.home.pagesReadToday}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{periodLabel[period]}</Text>
          <Text style={styles.totalLabel}>
            {t.home.totalInPeriod}: {totalPeriod} {t.progress.pages}
          </Text>
        </View>

        <View style={styles.periodRow}>
          {([7, 14, 30] as Period[]).map((p) => (
            <Pressable
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p} {language === 'id' ? 'Hari' : 'Days'}
              </Text>
            </Pressable>
          ))}
        </View>

        {period === 7 ? (
          <View style={styles.barChart}>
            {days.map((day, index) => {
              const value = dailyLog[day] || 0;
              const height = getBarHeight(value, maxPages);
              return (
                <View key={day} style={styles.barColumn}>
                  <Text style={styles.barValue}>
                    {value > 0 ? value : ''}
                  </Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height,
                        backgroundColor: value > 0 ? AppColors.primary : AppColors.inactive,
                      },
                    ]}
                  />
                  <Text style={[styles.barLabel, { fontSize: 10 }]}>
                    {getDayLabel(day, language, period)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={handleContentSizeChange}
          >
            <View style={styles.barChartScrolled}>
              {days.map((day, index) => {
                const value = dailyLog[day] || 0;
                const height = getBarHeight(value, maxPages);
                const showLabel = index % showEveryNthLabel === 0 || index === days.length - 1;
                const labelSize = period === 30 ? 7 : 8;
                const columnWidth = 48;
                return (
                  <View key={day} style={[styles.barColumnFixed, { width: columnWidth }]}>
                    <Text style={styles.barValue}>
                      {value > 0 ? value : ''}
                    </Text>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor: value > 0 ? AppColors.primary : AppColors.inactive,
                        },
                      ]}
                    />
                    <Text style={[styles.barLabel, { fontSize: labelSize }]}>
                      {showLabel ? getDayLabel(day, language, period) : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    gap: 14,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  todayInfo: {
    flex: 1,
  },
  todayCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  todayLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  chartCard: {
    backgroundColor: AppColors.card,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  totalLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: AppColors.background,
  },
  periodButtonActive: {
    backgroundColor: AppColors.primary,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  periodTextActive: {
    color: AppColors.white,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: 16,
  },
  barChartScrolled: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: 16,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barColumnFixed: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 3,
  },
  bar: {
    width: '60%',
    maxWidth: 28,
    borderRadius: 3,
    minHeight: 4,
  },
  barLabel: {
    color: AppColors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
});
