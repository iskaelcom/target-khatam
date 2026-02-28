import DonutChart from '@/components/charts/DonutChart';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DailyTargetCard() {
    const { targetSettings, dailyTarget, daysRemaining, todayPages, overallProgress } = useProgress();
    const { t } = useLanguage();

    // Don't show if target is disabled or not configured
    if (!targetSettings.enabled || !targetSettings.startDate || dailyTarget === null) {
        return null;
    }

    // Determine status
    let statusIcon: any;
    let statusText: string;
    let statusColor: string;

    if (daysRemaining === 0) {
        statusIcon = 'clock-alert-outline';
        statusText = t.target.targetEnded;
        statusColor = AppColors.warning;
    } else if (todayPages > dailyTarget) {
        statusIcon = 'check-circle';
        statusText = t.target.ahead;
        statusColor = AppColors.success;
    } else if (todayPages === dailyTarget) {
        statusIcon = 'check-circle';
        statusText = t.target.onTrack;
        statusColor = AppColors.success;
    } else {
        const pagesLeft = dailyTarget - todayPages;
        statusIcon = 'alert-circle-outline';
        statusText = `${t.target.behind} (${pagesLeft} ${t.target.pagesRemaining})`;
        statusColor = AppColors.warning;
    }

    const progressPercentage = dailyTarget > 0 ? Math.round(Math.min((todayPages / dailyTarget) * 100, 100)) : 0;

    // Target page for today
    const pagesReadBeforeToday = overallProgress.pagesRead - todayPages;
    const targetPage = Math.min(pagesReadBeforeToday + dailyTarget, 604);

    // End date — for target_date mode use the stored date directly; for others derive from daysRemaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let endDateStr: string;
    if (targetSettings.mode === 'target_date' && targetSettings.targetDate) {
        endDateStr = new Date(targetSettings.targetDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + (daysRemaining ?? 0));
        endDateStr = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Generate mode description
    let modeDescription: string;
    if (targetSettings.mode === 'days') {
        modeDescription = `Target Khatam dalam ${targetSettings.targetDays} ${t.target.presets.week.includes('Days') ? 'Days' : 'Hari'}`;
    } else if (targetSettings.mode === 'target_date' && targetSettings.targetDate) {
        const d = new Date(targetSettings.targetDate + 'T00:00:00');
        const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        modeDescription = `${t.target.targetDateLabel} ${dateLabel}`;
    } else {
        modeDescription = `Target Khatam ${targetSettings.khatamPerMonth}x per Bulan`;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons name="target" size={24} color={AppColors.primary} />
                    <View>
                        <Text style={styles.title}>{t.target.title}</Text>
                        <Text style={styles.modeText}>{modeDescription}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.chartContainer}>
                    <DonutChart
                        percentage={progressPercentage}
                        pagesRead={todayPages}
                        totalPages={dailyTarget}
                        size={60}
                    />
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{dailyTarget}</Text>
                        <Text style={styles.statLabel}>{t.target.pagesPerDay}</Text>
                        <Text style={styles.statSubInfo}>{t.target.upToPage} {targetPage}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{daysRemaining}</Text>
                        <Text style={styles.statLabel}>{t.target.daysRemaining}</Text>
                        <Text style={styles.statSubInfo}>{t.target.untilDate} {endDateStr}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statusRow}>
                <MaterialCommunityIcons name={statusIcon} size={18} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.card,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.textPrimary,
    },
    modeText: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginTop: 2,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 16,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 12,
    },
    statItem: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AppColors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    statSubInfo: {
        fontSize: 11,
        color: AppColors.secondary,
        marginTop: 2,
        textAlign: 'center',
        opacity: 0.75,
    },
    statDivider: {
        height: 1,
        backgroundColor: AppColors.cardBorder,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        justifyContent: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: AppColors.cardBorder,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
