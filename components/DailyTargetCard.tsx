import DonutChart from '@/components/charts/DonutChart';
import { AppColors } from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DailyTargetCard() {
    const { targetSettings, dailyTarget, daysRemaining, todayPages } = useProgress();
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
        statusIcon = 'alert-circle-outline';
        statusText = t.target.behind;
        statusColor = AppColors.warning;
    }

    const progressPercentage = dailyTarget > 0 ? Math.round(Math.min((todayPages / dailyTarget) * 100, 100)) : 0;

    // Generate mode description
    const modeDescription = targetSettings.mode === 'days'
        ? `Target Khatam dalam ${targetSettings.targetDays} ${t.target.presets.week.includes('Days') ? 'Days' : 'Hari'}`
        : `Target Khatam ${targetSettings.khatamPerMonth}x per Bulan`;

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
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{daysRemaining}</Text>
                        <Text style={styles.statLabel}>{t.target.daysRemaining}</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
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
